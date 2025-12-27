<?php

namespace App\Http\Controllers;

use App\Models\LaboratoryRequest;
use App\Models\User;
use App\Models\Patient;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class LaboratoryRequestController extends Controller
{

    public function store_laboratory_request(Request $request)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'patient_id' => 'required',
                'test_names' => 'nullable|array',
                'others' => 'nullable|string',
                'appointment_id' => 'nullable|string',
                'patient_visit_record_id' => 'required|string',
            ]);

            $patientId = $validated['patient_id'];
            $visitRecordId = $validated['patient_visit_record_id'];
            $appointmentId = $validated['appointment_id'] ?? null;
            $testNames = $validated['test_names'] ?? [];

            // Delete removed standard tests (ignore "others")
            LaboratoryRequest::where('patient_id', $patientId)
                ->where('patient_visit_record_id', $visitRecordId)
                ->whereNull('others')
                ->whereNotIn('test_name', $testNames)
                ->delete();

            // Upsert standard tests
            foreach (array_filter($testNames) as $test) {
                LaboratoryRequest::updateOrCreate(
                    [
                        'patient_id' => $patientId,
                        'patient_visit_record_id' => $visitRecordId,
                        'doctor_id' => Auth::id(),
                        'test_name' => $test,
                        'others' => null,
                    ],
                    [
                        'appointment_id' => $appointmentId,
                    ]
                );
            }

            // Handle "others"
            if (!empty($validated['others'])) {
                $others = collect(explode(',', $validated['others']))
                    ->map(fn($item) => trim($item))
                    ->filter()
                    ->unique()
                    ->implode(', ');

                LaboratoryRequest::updateOrCreate(
                    [
                        'patient_id' => $patientId,
                        'patient_visit_record_id' => $visitRecordId,
                        'doctor_id' => Auth::id(),
                        'test_name' => null,
                    ],
                    [
                        'appointment_id' => $appointmentId,
                        'others' => $others,
                    ]
                );
            } else {
                // Delete "others" if empty
                LaboratoryRequest::where('patient_id', $patientId)
                    ->where('patient_visit_record_id', $visitRecordId)
                    ->where('doctor_id', Auth::id())
                    ->whereNotNull('others')
                    ->delete();
            }

            DB::commit();

            return redirect()->back()->with('success', 'Laboratory requests saved successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();

            report($e); // logs the error

            return redirect()->back()->withErrors([
                'error' => 'Something went wrong while saving laboratory requests.',
                'errorMessage' => $e->getMessage(),
            ]);
        }
    }


    public function getPatientRequests($patientId, $app_id)
    {
        $requests = LaboratoryRequest::where('patient_id', $patientId)->where('appointment_id', $app_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests);
    }

    public function print($id, $app_id): Response
    {
        // Check if doctor_id exists for this patient and appointment
        $doctor_id = LaboratoryRequest::where('patient_id', $id)
            ->where('appointment_id', $app_id)
            ->value('doctor_id');

        if (!$doctor_id) {
            abort(404, 'Doctor not found for this appointment.');
        }

        // Fetch doctor details
        $doctor = User::leftJoin('doctors', 'users.id', '=', 'doctors.user_id')
            ->where('users.id', $doctor_id)
            ->select('users.first_name as doctor_name', 'users.last_name as doctor_last_name', 'doctors.license_number', 'doctors.ptr_number')
            ->first();

        if (!$doctor) {
            abort(404, 'Doctor record not found.');
        }

        // Fetch patient
        $patient = Patient::where('patient_id', $id)->first();
        if (!$patient) {
            abort(404, 'Patient not found.');
        }

        // Fetch lab tests
        $patient_laboratory = LaboratoryRequest::where('patient_id', $id)
            ->where('appointment_id', $app_id)
            ->get();

        if ($patient_laboratory->isEmpty()) {
            abort(404, 'No laboratory tests found.');
        }

        $medications = $patient_laboratory->flatMap(function ($item) {
            // If the record has standard test_name
            if ($item->test_name) {
                return [['name' => $item->test_name]];
            }

            // If it's the 'others' record, split by comma
            if ($item->others) {
                return collect(explode(',', $item->others))
                    ->map(fn($name) => ['name' => trim($name)]);
            }

            // Default fallback
            return [['name' => 'N/A']];
        })->values();

        // Prepare data
        $laboratory = [
            'patient_name' => $patient->first_name ?? 'N/A',
            'address' => $patient->address ?? 'N/A',
            'age' => $patient->age ?? 'N/A',
            'sex' => $patient->gender ?? 'N/A',
            'date' => now()->format('F j, Y'),
            'doctor_name' => ($doctor->doctor_name ?? '') . ' ' . ($doctor->doctor_last_name ?? ''),
            'license_no' => $doctor->license_number ?? 'N/A',
            'ptr_no' => $doctor->ptr_number ?? 'N/A',
            'medications' => $medications
        ];

        return Inertia::render('Laboratory/Print', [
            'laboratory' => $laboratory
        ]);
    }
}
