<?php

namespace App\Http\Controllers;

use App\Models\LaboratoryRequest;
use App\Models\User;
use App\Models\Patient;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Inertia\Response;

class LaboratoryRequestController extends Controller
{
    public function store_laboratory_request(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required',
            'test_names' => 'nullable|array',
            'others' => 'nullable|string',
            'appointment_id' => 'required|string'
        ]);


        $patientId = $validated['patient_id'];
        $appointment_id = $validated['appointment_id'];
        $testNames = $validated['test_names'] ?? [];

        // 1. Delete removed standard tests (ignore "others" entries)
        $existingTests = LaboratoryRequest::where('patient_id', $patientId)->where('appointment_id', $appointment_id)
            ->whereNull('others') // only standard test names
            ->pluck('test_name')
            ->toArray();

        $toDelete = array_diff($existingTests, $testNames);

        if (!empty($toDelete)) {
            LaboratoryRequest::where('patient_id', $patientId)
                ->whereNull('others')
                ->whereIn('test_name', $toDelete)
                ->delete();
        }

        // 2. Create or update standard tests
        foreach (array_filter($testNames) as $test) {
            LaboratoryRequest::updateOrCreate(
                [
                    'patient_id' => $patientId,
                    'doctor_id' => Auth::id(),
                    'test_name' => $test,
                    'appointment_id' => $appointment_id,
                    'others' => null
                ]
            );
        }


        if (array_key_exists('others', $validated)) {
            $others = collect(explode(',', $validated['others']))
                ->map(fn($item) => trim($item))
                ->filter()
                ->unique()
                ->implode(', ');

            $existing = LaboratoryRequest::where('patient_id', $patientId)
                ->where('appointment_id', $appointment_id)
                ->where('doctor_id', Auth::id())
                ->whereNotNull('others')
                ->first();

            if ($existing) {
                if ($validated['others'] == '') {
                    $existing->delete();
                }
                // Update 'others' in the existing row
                $existing->update(['others' => $others]);
            } else {
                // Create a new row with NULL test_name
                if ($validated['others'] != '') {
                    LaboratoryRequest::create([
                        'patient_id' => $patientId,
                        'doctor_id' => Auth::id(),
                        'appointment_id' => $appointment_id,
                        'test_name' => null,
                        'others' => $others
                    ]);
                }
            }
        }


        return redirect()->back()->with('success', 'Laboratory requests saved successfully.');
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
