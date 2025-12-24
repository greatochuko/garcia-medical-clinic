<?php

namespace App\Http\Controllers;

use App\Events\AppointmentUpdated;
use App\Models\Appointment;
use App\Models\FrequencyList;
use App\Models\MedicalHistory;
use App\Models\MedicationList;
use App\Models\PatientVisitRecord;
use App\Models\PhysicalExam;
use App\Models\Plan;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
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
                'patient',
                'doctor',
                'appointment',
                'labRequest',
                'medicalCertificate',
            ])
                ->where('patient_id', $record->patient_id)
                ->where('is_closed', true)
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
        DB::beginTransaction();

        try {
            $record = PatientVisitRecord::findOrFail($id);

            if ($record->is_closed) {
                return back()->withErrors([
                    'record' => 'Closed records cannot be modified',
                ]);
            }

            $validated = $request->validate([
                'chief_complaints' => ['nullable', 'array'],
                'physical_exams' => ['nullable', 'array'],
                'plans' => ['nullable', 'array'],
                'diagnoses' => ['nullable', 'array'],
                'diagnostic_results' => ['nullable', 'array'],
            ]);

            // Update simple JSON / array fields
            $record->update($validated);

            /*
            |--------------------------------------------------------------------------
            | Physical Exams
            |--------------------------------------------------------------------------
            */
            if (!empty($validated['physical_exams'])) {
                foreach ($validated['physical_exams'] as $examName) {
                    $examName = trim($examName);

                    PhysicalExam::firstOrCreate(
                        ['name' => Str::lower($examName)],
                        [
                            'name' => $examName,
                            'status' => true,
                        ]
                    );
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Plans
            |--------------------------------------------------------------------------
            */
            if (!empty($validated['plans'])) {
                foreach ($validated['plans'] as $planName) {
                    $planName = trim($planName);

                    Plan::firstOrCreate(
                        ['name' => Str::lower($planName)],
                        ['name' => $planName]
                    );
                }
            }

            DB::commit();

            return back()->with([
                'success' => 'Form Saved Successfully',
                'record' => $record->fresh(),
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);

            return back()->withErrors([
                'error' => 'Something went wrong while saving the record',
                'errorMessage' => $e->getMessage(),
            ]);
        }
    }

    /**
     * CLOSE a patient visit record
     * This is the ONLY place doctor_id and is_closed can be set
     */
    public function close(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $record = PatientVisitRecord::findOrFail($id);

            if ($record->is_closed) {
                return back()->withErrors([
                    'record' => 'This record has already been closed',
                ]);
            }

            $user = auth()->user();

            if (!in_array($user->role, ['doctor', 'admin'])) {
                return back()->withErrors([
                    'authorization' => 'Only a doctor or admin can close patient records',
                ]);
            }

            $validated = $request->validate([
                'chief_complaints' => ['nullable', 'array'],
                'physical_exams' => ['nullable', 'array'],
                'plans' => ['nullable', 'array'],
                'diagnoses' => ['required', 'array'],
                'diagnostic_results' => ['nullable', 'array'],
            ]);

            if (empty($validated['diagnoses'])) {
                return back()->withErrors([
                    'diagnoses' => 'Cannot close record without at least one diagnosis',
                ]);
            }

            // Update visit data first
            $record->update(array_merge(
                collect($validated)->except(['physical_exams', 'plans'])->toArray(),
                [
                    'doctor_id' => $user->id,
                ]
            ));

            /*
            |--------------------------------------------------------------------------
            | Physical Exams (catalog)
            |--------------------------------------------------------------------------
            */
            if (!empty($validated['physical_exams'])) {
                foreach ($validated['physical_exams'] as $examName) {
                    $examName = trim($examName);

                    PhysicalExam::firstOrCreate(
                        ['name' => Str::lower($examName)],
                        [
                            'name' => $examName,
                            'status' => true,
                        ]
                    );
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Plans (catalog)
            |--------------------------------------------------------------------------
            */
            if (!empty($validated['plans'])) {
                foreach ($validated['plans'] as $planName) {
                    $planName = trim($planName);

                    Plan::firstOrCreate(
                        ['name' => Str::lower($planName)],
                        ['name' => $planName]
                    );
                }
            }

            // Close LAST
            $record->update([
                'is_closed' => true,
            ]);

            $appointment = Appointment::find($record->appointment_id);
            if (!$appointment) {
                return back()->withErrors(['error' => 'Appointment not found']);
            }

            $appointment->status = "for_billing";

            $appointment->save();

            $appointment->load(['patient.vitals', 'serviceCharge']);

            broadcast(new AppointmentUpdated($appointment))->toOthers();

            DB::commit();

            // return redirect()->route('appointments.index')
            //     ->with('success', 'Form closed and medical record created successfully!');

            return back()->with([
                'success' => 'Patient visit record closed successfully',
                'record' => $record->fresh(),
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);

            return back()->withErrors([
                'error' => 'Something went wrong while closing the record',
                'errorMessage' => $e->getMessage(),
            ]);
        }
    }

    public function reopen(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $record = PatientVisitRecord::findOrFail($id);

            if (!$record->is_closed) {
                return back()->withErrors([
                    'record' => 'This record is not closed',
                ]);
            }

            $appointment = Appointment::find($record->appointment_id);

            if ($appointment && $appointment->status !== 'for_billing') {
                return back()->withErrors([
                    'appointment' => 'Cannot reopen record because the associated appointment has already been billed.',
                ]);
            }

            $user = auth()->user();

            // Role check
            if (!in_array($user->role, ['doctor', 'admin'])) {
                return back()->withErrors([
                    'authorization' => 'Only a doctor or admin can reopen patient records',
                ]);
            }

            // Optionally track who reopened
            $record->update([
                'is_closed' => false,
            ]);

            DB::commit();

            return back()->with([
                'success' => 'Patient visit record reopened successfully',
                'record' => $record->fresh(),
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);

            return back()->withErrors([
                'error' => 'Something went wrong while reopening the record',
                'errorMessage' => $e->getMessage(),
            ]);
        }
    }
}
