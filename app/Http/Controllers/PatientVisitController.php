<?php

namespace App\Http\Controllers;

use App\Models\FrequencyList;
use Illuminate\Support\Facades\DB;
use App\Models\Patient;
use Illuminate\Support\Facades\Auth;
use App\Models\PatientPrescription;
use App\Models\PatientChiefComplaint;
use App\Models\PatientPhysicalExam;
use App\Models\MedicalHistory;
use App\Models\UnfinishedDoc;
use App\Models\MedicalRecord;
use App\Models\MedicationList;
use App\Models\VitalSignsModal;
use App\Models\PatientNotes;
use App\Models\PatientPlans;
use App\Models\Plan;
use App\Models\PatientDiagnosis;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientVisitController extends Controller
{
    public function index($id, $appointment_id)
    {
        $patient = Patient::with(["vitals"])->where('patient_id', $id)->first();
        $patient['medicalHistory'] = $this->get_medical_history($id);
        $prescriptions = PatientPrescription::where('patient_id', $patient->patient_id)
            ->where('appointment_id', $appointment_id)
            ->orderBy('created_at', 'desc')
            ->get();
        $medications = MedicationList::all();

        return Inertia::render('MedicalRecords/PatientVisitForm', [
            'patient' => $patient,
            'appointmentId' => $appointment_id,
            "prescriptions" => $prescriptions,
            "medications" => $medications
        ]);
    }

    public function get_medical_history($id)
    {
        $medical_histories = MedicalHistory::where('patient_id', $id)->pluck('disease');
        return $medical_histories;
    }


    public function add_medical_history(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'patient_id' => 'required|string',
            'diseases' => 'required|array'
        ]);
        // Delete existing history for this patient
        MedicalHistory::where('patient_id', $validated['patient_id'])->delete();
        // Insert each disease as a separate row
        foreach ($validated['diseases'] as $disease) {
            MedicalHistory::create([
                'patient_id' => $validated['patient_id'],
                'disease' => $disease
            ]);
        }
        return;
    }

    public function get_patient_chief_complaint($id, $app_id)
    {
        $patient_chief_complaint = PatientChiefComplaint::where('patient_id', $id)->where('appointment_id', $app_id)->get();
        return $patient_chief_complaint;
    }

    public function delete_patient_chief_complaint(Request $request)
    {
        $patient_chief_complaint = PatientChiefComplaint::where('chief_complaint', $request->chief_complaint)->delete();
        return true;
    }

    public function add_patient_chief_complaint(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|string|max:255',
            'chief_complaint' => 'required|string|max:1000',
            'appointment_id' => 'required'
        ]);

        $patientChiefComplaint = PatientChiefComplaint::updateOrCreate(
            [
                'patient_id'       => $request->patient_id,
                'chief_complaint'  => $request->chief_complaint,
                'appointment_id' =>   $request->appointment_id
            ],
            [
                'updated_at' => now() // optional to reflect update time
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Chief complaint added or updated successfully.',
            'data'    => $patientChiefComplaint,
        ]);
    }

    public function update_status($id, $app_id, Request $request)
    {
        $data = $request->all();
        $user = Auth::user();
        if ($user->role !== 'doctor' && $user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized. Only doctors can perform this action.'], 403);
        }
        $did = $user->id;
        $record = MedicalRecord::where('patient_id', $id)
            ->where('closed_appointment_id', $app_id)
            ->first();
        if (!$record) {
            return response()->json(['error' => 'Medical record not found.'], 404);
        }
        $record->status = $data['status'];
        $record->doctor_id = $did;
        $record->save();


        return response()->json([
            'message' => 'Medical record status updated to modify.',
            'record' => $record
        ]);
    }

    public function check_status($id, $app_id)
    {
        $did = Auth::id();
        // Check if record exists
        $record = MedicalRecord::where('patient_id', $id)
            ->where('closed_appointment_id', $app_id)
            ->first();
        if (!$record) {
            // If not found, create a new one
            $record = MedicalRecord::create([
                'doctor_id' => $did,
                'patient_id' => $id,
                'closed_appointment_id' => $app_id,
                'status' => 'open',
                'date' => now(),
            ]);
        }

        // Now fetch the record again with doctor and user info
        $check = MedicalRecord::leftJoin('users', 'medical_records.doctor_id', '=', 'users.id')
            ->leftJoin('doctors', 'users.id', '=', 'doctors.user_id')
            ->where('medical_records.id', $record->id) // use the new or existing record ID
            ->select('medical_records.*', 'users.*', 'doctors.license_number', 'doctors.ptr_number')
            ->first();

        return $check;
    }

    public function get_patient_physical_exam($id, $app_id)
    {
        $patient_physical_exam = PatientPhysicalExam::where('patient_id', $id)->where('appointment_id', $app_id)->get();
        return $patient_physical_exam;
    }

    public function delete_patient_physical_exam(Request $request)
    {
        $patient_physical_exam = PatientPhysicalExam::where('physical_exam', $request->physical_exam)->delete();
        return true;
    }

    public function add_patient_physical_exam(Request $request)
    {
        $request->validate([
            'patient_id'     => 'required|string|max:255',
            'physical_exam'  => 'required|string|max:1000',
            'appointment_id'  => 'required',
        ]);

        // Update if exists, otherwise create new
        $patientPhysicalExam = PatientPhysicalExam::updateOrCreate(
            [
                'patient_id'    => $request->patient_id,
                'physical_exam' => $request->physical_exam,
                'appointment_id' => $request->appointment_id,
            ],
            [
                'updated_at' => now() // Optional: update timestamp if already exists
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Physical exam added or updated successfully.',
            'data' => $patientPhysicalExam
        ]);
    }


    public function get_patient_notes($id, $app_id)
    {
        $patient_notes = PatientNotes::where('patient_id', $id)->where('appointment_id', $app_id)->get();
        return $patient_notes;
    }

    public function delete_patient_notes(Request $request)
    {
        $patient_notes = PatientNotes::where('note', $request->note)->delete();
        return true;
    }

    public function add_patient_notes(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|string|max:255',
            'note'       => 'required|string|max:1000',
            'appointment_id'       => 'required'
        ]);

        $note = $request->note;

        // Step 1: Update existing note if found, or create a new one
        $patientNote = PatientNotes::updateOrCreate(
            [
                'patient_id' => $request->patient_id,
                'note'       => $note,
                'appointment_id'       => $request->appointment_id,
            ],
            [
                'updated_at' => now(), // Optional, ensures timestamp is updated
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Patient note added or updated successfully.',
            'data' => $patientNote
        ]);
    }


    public function get_patient_plans($id, $app_id)
    {
        $patient_plans = PatientPlans::where('patient_id', $id)->where('appointment_id', $app_id)->get();
        return $patient_plans;
    }

    public function delete_patient_plans(Request $request)
    {
        $patient_plans = PatientPlans::where('plan', $request->plan)->delete();
        return true;
    }


    public function add_patient_plans(Request $request)
    {
        $request->validate([
            'patient_id' => 'required',
            'plan' => 'required|string|max:255',
            'appointment_id' => 'required'
        ]);

        $planName = $request->plan;

        // Step 1: Ensure the plan exists in the master Plan table
        // $existingPlan = Plan::firstOrCreate(['name' => $planName]);

        // Step 2: Update if already exists or create new in patient_plans
        $patientPlan = PatientPlans::updateOrCreate(
            [
                'patient_id' => $request->patient_id,
                'plan'       => $planName,
                'appointment_id'       => $request->appointment_id,
            ],
            [
                'updated_at' => now(), // This ensures that even if the record exists, its timestamp is refreshed
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Patient plan added or updated successfully.',
            'data' => $patientPlan,
        ]);
    }



    public function get_patient_diagnosis($id, $app_id)
    {
        $patient_plans = PatientDiagnosis::where('patient_id', $id)->where('appointment_id', $app_id)->get();
        return $patient_plans;
    }

    public function delete_patient_diagnosis(Request $request)
    {
        $patient_plans = PatientDiagnosis::where('diagnosis', $request->diagnosis)->delete();
        return true;
    }


    public function add_patient_diagnosis(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|string',
            'diagnosis' => 'required|string',
            'appointment_id' => 'required'
        ]);

        // Update if exists, otherwise create
        $patientDiagnosis = PatientDiagnosis::updateOrCreate(
            [
                'patient_id' => $request->patient_id,
                'diagnosis'  => $request->diagnosis,
                'appointment_id'  => $request->appointment_id,
            ],
            $request->all() // You can also specify fields explicitly if needed
        );

        return response()->json([
            'success' => true,
            'message' => 'Diagnosis added or updated successfully.',
            'data' => $patientDiagnosis
        ]);
    }

    public function patientprescription_add(Request $request)
    {
        // Step 1: Validate input
        $validated = $request->validate([
            'patient_id' => 'required|exists:patient_records,patient_id',
            'medication' => 'required|string|max:255',
            'dosage'     => 'nullable|string|max:255',
            'frequency'  => 'nullable|string|max:255',
            'amount'     => 'nullable|string|max:255',
            'duration'   => 'nullable|string|max:255',
            'appointment_id'  => 'required',
        ]);

        try {
            // Step 2: Check medication existence

            if (!empty($validated['medication'])) {
                MedicationList::firstOrCreate(
                    ['name' => $validated['medication']],
                    ['created_at' => now(), 'updated_at' => now()]
                );
            }


            // Step 3: Check frequency existence

            if (!empty($validated['frequency'])) {
                FrequencyList::firstOrCreate(
                    ['name' => $validated['frequency']],
                    ['created_at' => now(), 'updated_at' => now()]
                );
            }


            // Step 4: Save the prescription
            $validated['doctor_id'] = Auth::id();
            $prescription = PatientPrescription::create($validated);

            // Step 5: Return success response
            // return response()->json([
            //     'success' => true,
            //     'message' => 'Prescription added successfully.',
            //     'data' => $prescription
            // ]);

            return redirect()->back()->with('success', 'Prescription added successfully.');
        } catch (\Exception $e) {
            // Step 6: Return error response
            // return response()->json([
            //     'success' => false,
            //     'message' => 'An error occurred while saving the prescription.',
            //     'error' => $e->getMessage()
            // ], 500);
            return back()->withErrors(['error' => 'An error occurred while saving the prescription.']);
        }
    }


    public function patientprescription_update(Request $request)
    {
        // Step 1: Validate input
        $validated = $request->validate([
            'id'         => 'required',
            'patient_id' => 'required|exists:patient_records,patient_id',
            'medication' => 'required|string|max:255',
            'dosage'     => 'nullable|string|max:255',
            'frequency'  => 'required|string|max:255',
            'amount'     => 'nullable|string|max:255',
            'duration'   => 'nullable|string|max:255',
        ]);

        try {
            // Step 2: Create the prescription
            $prescription = PatientPrescription::findOrFail($validated['id']);

            // Step 3: Update fields
            $prescription->update($validated);

            // Step 3: Return a JSON success response
            return response()->json([
                'success' => true,
                'message' => 'Prescription added successfully.',
                'data' => $prescription
            ]);
        } catch (\Exception $e) {
            // Step 4: Return a JSON error response
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while saving the prescription.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function patientprescription_get($id, $app_id)
    {
        $prescriptions = PatientPrescription::where('patient_id', $id)->where('appointment_id', $app_id)->get();
        return response()->json([
            'success' => true,
            'data' => $prescriptions,
        ]);
    }

    public function patientprescription_remove($id)
    {
        $prescription_delete = PatientPrescription::destroy($id);
        return redirect()->back()->with('success', 'Prescription removed successfully.');
    }
}
