<?php

namespace App\Http\Controllers;

use App\Models\FrequencyList;
use App\Models\LaboratoryRequest;
use App\Models\MedicalHistory;
use App\Models\MedicationList;
use App\Models\PatientVisitRecord;
use App\Models\PhysicalExam;
use App\Models\Plan;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PatientVisitRecordController extends Controller
{
    /**
     * GET a single patient visit record
     */

    public function show($id)
    {
        try {
            $record = PatientVisitRecord::with([
                'patient.vitals',
                'doctor',
                'appointment',
                'labRequest',
                'medicalCertificate',
                'prescriptions.medication',
                'prescriptions.frequency',
            ])->findOrFail($id);

            // Fetch all other records for the same patient, excluding the current one
            $medicalRecords = PatientVisitRecord::with([
                'doctor',
                'appointment',
                'labRequest',
                'medicalCertificate',
            ])
                ->where('patient_id', $record->patient_id)
                ->where('id', '!=', $record->id) // exclude current record
                ->orderBy('created_at', 'desc')
                ->get();

            $medicalHistory = MedicalHistory::where('patient_id', $record->patient->patient_id)->pluck('disease');

            $inputOptions = [
                'plans' => Plan::all(),
                'physical_exams' => PhysicalExam::all(),
                'medications' => MedicationList::all(),
                'frequencies' => FrequencyList::all(),
            ];

            return Inertia::render('MedicalRecords/PatientVisitForm', [
                'patientVisitRecord' => $record,
                'medicalRecords' => $medicalRecords,
                'inputOptions' => $inputOptions,
                'medicalHistory' => $medicalHistory,
            ]);
        } catch (ModelNotFoundException $e) {
            abort(404, 'Patient visit record not found.');
        }
    }


    /**
     * STORE a new (OPEN) patient visit record
     * doctor_id and is_closed are NOT allowed here
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'patient_id' => ['required', 'exists:patient_records,id'],
                'appointment_id' => ['nullable', 'exists:appointments,id'],
            ]);

            $record = PatientVisitRecord::create($validated);

            return redirect()
                ->route('patientVisitRecords.show', ['id' => $record->id])
                ->with('success', 'Patient visit record created successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors separately if needed
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            // Log the exception for debugging
            Log::error('Error creating patient visit record: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            dd($e->getMessage(), $e->getTraceAsString());

            // Redirect back with a generic error message
            return redirect()->back()
                ->with('error', 'An unexpected error occurred. Please try again.');

        }
    }

    /**
     * UPDATE an existing patient visit record
     * Only allowed if the record is NOT closed
     */
    public function update(Request $request, $id)
    {
        $record = PatientVisitRecord::findOrFail($id);

        if ($record->is_closed) {
            return response()->json([
                'success' => false,
                'message' => 'Closed records cannot be modified',
            ], 403);
        }

        $validated = $request->validate([
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'medical_certificate_id' => ['nullable', 'exists:medical_certificates,id'],

            'chief_complaints' => ['nullable', 'array'],
            'physical_exams' => ['nullable', 'array'],
            'prescriptions' => ['nullable', 'array'],
            'plans' => ['nullable', 'array'],
            'diagnoses' => ['nullable', 'array'],
            'diagnostic_results' => ['nullable', 'array'],
        ]);

        $record->update($validated);

        return response()->json([
            'success' => true,
            'data' => $record->fresh(),
        ]);
    }

    /**
     * CLOSE a patient visit record
     * This is the ONLY place doctor_id and is_closed can be set
     */
    public function closeRecord($id)
    {
        try {
            $record = PatientVisitRecord::findOrFail($id);

            if ($record->is_closed) {
                return back()->with([
                    'success' => false,
                    'message' => 'Record is already closed',
                ]);
            }

            if (empty($record->diagnosis)) {
                return back()->withErrors([
                    'diagnosis' => 'Cannot close record without a diagnosis',
                ]);
            }

            $user = auth()->user();

            // Role check
            if (!in_array($user->role, ['doctor', 'admin'])) {
                return back()->withErrors([
                    'authorization' => 'Patient records can only be closed by a doctor or admin',
                ]);
            }

            $record->doctor_id = $user->id;
            $record->is_closed = true;
            $record->save();

            return back()->with([
                'success' => true,
                'message' => 'Form closed successfully',
                'record' => $record->fresh(),
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'record' => 'Patient visit record not found',
            ]);
        } catch (\Throwable $e) {
            report($e);

            return back()->withErrors([
                'error' => 'An unexpected error occurred while closing the record',
            ]);
        }
    }
}
