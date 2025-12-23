<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\FrequencyList;
use App\Models\LaboratoryRequest;
use App\Models\MedicalCertificate;
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
use App\Models\PhysicalExam;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientVisitController extends Controller
{
    public function index($id, $appointment_id)
    {
        $patient = Patient::with(["vitals"])->where('patient_id', $id)->first();
        $patient['medicalHistory'] = $this->get_medical_history($id);
        $prescriptions = PatientPrescription::with(["medication", "frequency"])->where('patient_id', $patient->patient_id)
            ->where('appointment_id', $appointment_id)
            ->get();
        $patient['chief_complaint'] = $this->get_patient_chief_complaint($id, $appointment_id);
        $patient['physical_exam'] = $this->get_patient_physical_exam($id, $appointment_id);
        $patient['plan'] = $this->get_patient_plans($id, $appointment_id);
        $patient['diagnosis'] = $this->get_patient_diagnosis($id, $appointment_id);
        $inputOptions["plan"] = Plan::all();
        $inputOptions["physical_exam"] = PhysicalExam::all();
        $inputOptions["medications"] = MedicationList::all();
        $inputOptions["frequencies"] = FrequencyList::all();
        $medicalCertificate = MedicalCertificate::where('patient_id', $id)
            ->where('appointment_id', $appointment_id)
            ->first();
        $laboratoryRequest = LaboratoryRequest::where('patient_id', $id)
            ->where('appointment_id', $appointment_id)->get();
        $appointment = Appointment::where('id', $appointment_id)->first();
        $medicalRecords = MedicalRecord::with(['appointment.serviceCharge', 'doctor', 'patient'])
            ->where('patient_id', $patient['patient_id'])
            ->orderBy('created_at', 'desc')
            ->get();


        return Inertia::render('MedicalRecords/PatientVisitForm', [
            'patient' => $patient,
            'appointment' => $appointment,
            "prescriptions" => $prescriptions,
            "inputOptions" => $inputOptions,
            "medicalCertificate" => $medicalCertificate,
            "medicalRecords" => $medicalRecords,
            "laboratoryRequest" => $laboratoryRequest,
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


    // ---------------- CHIEF COMPLAINT ----------------
    public function get_patient_chief_complaint($id, $app_id)
    {
        $patient_chief_complaint = PatientChiefComplaint::where('patient_id', $id)
            ->where('appointment_id', $app_id)
            ->get();
        ;
        return $patient_chief_complaint;
    }

    public function add_patient_chief_complaint(Request $request)
    {
        try {
            $request->validate([
                'patient_id' => 'required|string|max:255',
                'chief_complaint' => 'required|string|max:1000',
                'appointment_id' => 'nullable',
                'patient_visit_record_id' => 'required'
            ]);

            PatientChiefComplaint::updateOrCreate(
                [
                    'patient_id' => $request->patient_id,
                    'chief_complaint' => $request->chief_complaint,
                    'appointment_id' => $request->appointment_id
                ],
                ['updated_at' => now()]
            );

            return back()->with('success', 'Chief complaint added or updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function update_patient_chief_complaint(Request $request)
    {
        try {
            $entriesToUpdate = $request->entriesToUpdate ?? [];
            $entriesToDelete = $request->entriesToDelete ?? [];

            if (!empty($entriesToDelete)) {
                $idsToDelete = array_column($entriesToDelete, 'id');
                PatientChiefComplaint::whereIn('id', $idsToDelete)->delete();
            }

            if (!empty($entriesToUpdate)) {
                foreach ($entriesToUpdate as $entry) {
                    PatientChiefComplaint::where('id', $entry['id'])
                        ->update(['chief_complaint' => $entry['chief_complaint']]);
                }
            }

            return back()->with('success', 'Chief complaint entry updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function delete_patient_chief_complaint(Request $request)
    {
        try {
            PatientChiefComplaint::where('chief_complaint', $request->chief_complaint)->delete();
            return back()->with('success', 'Chief complaint deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    // ---------------- PHYSICAL EXAM ----------------
    public function get_patient_physical_exam($id, $app_id)
    {
        $patient_physical_exam = PatientPhysicalExam::where('patient_id', $id)->where('appointment_id', $app_id)->get();
        return $patient_physical_exam;
    }

    public function add_patient_physical_exam(Request $request)
    {
        try {
            $request->validate([
                'patient_id' => 'required|string|max:255',
                'physical_exam' => 'required|string|max:1000',
                'appointment_id' => 'required',
            ]);

            $existingPhysicalExam = PhysicalExam::whereRaw('LOWER(name) = ?', [strtolower($request->physical_exam)])->first();

            if (!$existingPhysicalExam) {
                $existingPhysicalExam = PhysicalExam::create(['name' => $request->physical_exam]);
            }

            PatientPhysicalExam::updateOrCreate(
                [
                    'patient_id' => $request->patient_id,
                    'physical_exam' => $request->physical_exam,
                    'appointment_id' => $request->appointment_id,
                ],
                ['updated_at' => now()]
            );

            return back()->with('success', 'Physical exam added successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function update_patient_physical_exam(Request $request)
    {
        try {
            $entriesToUpdate = $request->entriesToUpdate ?? [];
            $entriesToDelete = $request->entriesToDelete ?? [];

            if (!empty($entriesToDelete)) {
                $idsToDelete = array_column($entriesToDelete, 'id');
                PatientPhysicalExam::whereIn('id', $idsToDelete)->delete();
            }

            if (!empty($entriesToUpdate)) {
                foreach ($entriesToUpdate as $entry) {
                    PatientPhysicalExam::where('id', $entry['id'])
                        ->update(['physical_exam' => $entry['physical_exam']]);
                }
            }

            return back()->with('success', 'Physical exam entry updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function delete_patient_physical_exam(Request $request)
    {
        try {
            PatientPhysicalExam::where('physical_exam', $request->physical_exam)->delete();
            return back()->with('success', 'Physical exam deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    // ---------------- PLANS ----------------
    public function get_patient_plans($id, $app_id)
    {
        $patient_plans = PatientPlans::where('patient_id', $id)->where('appointment_id', $app_id)->get();
        return $patient_plans;
    }

    public function add_patient_plans(Request $request)
    {
        try {
            $request->validate([
                'patient_id' => 'required',
                'plan' => 'required|string|max:255',
                'appointment_id' => 'required'
            ]);

            $existingPlan = Plan::whereRaw('LOWER(name) = ?', [strtolower($request->plan)])->first();

            if (!$existingPlan) {
                $existingPlan = Plan::create(['name' => $request->plan]);
            }

            PatientPlans::updateOrCreate(
                [
                    'patient_id' => $request->patient_id,
                    'appointment_id' => $request->appointment_id,
                    'plan' => $existingPlan->name,
                ],
                [
                    'updated_at' => now()
                ]
            );

            return back()->with('success', 'Plan added successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }


    public function update_patient_plan(Request $request)
    {
        try {
            $entriesToUpdate = $request->entriesToUpdate ?? [];
            $entriesToDelete = $request->entriesToDelete ?? [];

            if (!empty($entriesToDelete)) {
                $idsToDelete = array_column($entriesToDelete, 'id');
                PatientPlans::whereIn('id', $idsToDelete)->delete();
            }

            if (!empty($entriesToUpdate)) {
                foreach ($entriesToUpdate as $entry) {
                    PatientPlans::where('id', $entry['id'])
                        ->update(['plan' => $entry['plan']]);
                }
            }

            return back()->with('success', 'Plan entry updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function delete_patient_plans(Request $request)
    {
        try {
            PatientPlans::where('plan', $request->plan)->delete();
            return back()->with('success', 'Plan deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    // ---------------- DIAGNOSIS ----------------
    public function get_patient_diagnosis($id, $app_id)
    {
        $patient_plans = PatientDiagnosis::where('patient_id', $id)->where('appointment_id', $app_id)->get();
        return $patient_plans;
    }

    public function add_patient_diagnosis(Request $request)
    {
        try {
            $request->validate([
                'patient_id' => 'required|string',
                'diagnosis' => 'required|string',
                'appointment_id' => 'required'
            ]);

            PatientDiagnosis::updateOrCreate(
                [
                    'patient_id' => $request->patient_id,
                    'diagnosis' => $request->diagnosis,
                    'appointment_id' => $request->appointment_id,
                ],
                $request->all()
            );

            return back()->with('success', 'Diagnosis added or updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function update_patient_diagnosis(Request $request)
    {
        try {
            $entriesToUpdate = $request->entriesToUpdate ?? [];
            $entriesToDelete = $request->entriesToDelete ?? [];

            if (!empty($entriesToDelete)) {
                $idsToDelete = array_column($entriesToDelete, 'id');
                PatientDiagnosis::whereIn('id', $idsToDelete)->delete();
            }

            if (!empty($entriesToUpdate)) {
                foreach ($entriesToUpdate as $entry) {
                    PatientDiagnosis::where('id', $entry['id'])
                        ->update(['diagnosis' => $entry['diagnosis']]);
                }
            }

            return back()->with('success', 'Diagnosis entry updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function delete_patient_diagnosis(Request $request)
    {
        try {
            PatientDiagnosis::where('diagnosis', $request->diagnosis)->delete();
            return back()->with('success', 'Diagnosis deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    // ---------------- PRESCRIPTIONS ----------------
    public function patientprescription_get($id, $app_id)
    {
        $prescriptions = PatientPrescription::with(["medication", "frequency"])->where('patient_id', $id)->where('appointment_id', $app_id)->get();
        return response()->json([
            'success' => true,
            'data' => $prescriptions,
        ]);
    }

    public function patientprescription_add(Request $request)
    {
        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patient_records,patient_id',
                'medication_id' => 'nullable|integer',
                'medication' => 'required|string|max:255',
                'dosage' => 'required|string|max:255',
                'frequency_id' => 'nullable|integer',
                'frequency' => 'required|string|max:255',
                'amount' => 'required|string|max:255',
                'duration' => 'required|string|max:255',
                'appointment_id' => 'nullable',
                'patient_visit_record_id' => 'required',
            ]);

            // Get or create medication
            if (!empty($validated['medication_id'])) {
                $medication = MedicationList::findOrFail($validated['medication_id']);
            } else {
                $medication = MedicationList::create([
                    'name' => $validated['medication'],
                    'category' => 'General',
                    'price' => 0,
                    'quantity' => 0,
                    'controlled' => false,
                ]);
            }

            // Get or create frequency
            if (!empty($validated['frequency_id'])) {
                $frequency = FrequencyList::findOrFail($validated['frequency_id']);
            } else {
                $frequency = FrequencyList::firstOrCreate(['name' => $validated['frequency']]);
            }

            // Create prescription
            PatientPrescription::create([
                'patient_id' => $validated['patient_id'],
                'doctor_id' => Auth::id(),
                'medication_id' => $medication->id,
                'dosage' => $validated['dosage'],
                'frequency_id' => $frequency->id,
                'amount' => $validated['amount'],
                'quantity' => $validated['amount'],
                'duration' => $validated['duration'],
                'appointment_id' => $validated['appointment_id'],
                'patient_visit_record_id' => $validated['patient_visit_record_id'],
            ]);

            return back()->with('success', 'Prescription added successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function patientprescription_update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patient_records,patient_id',
                'medication_id' => 'nullable|integer',
                'medication' => 'required|string|max:255',
                'dosage' => 'required|string|max:255',
                'frequency_id' => 'nullable|integer',
                'frequency' => 'required|string|max:255',
                'amount' => 'required|max:255',
                'duration' => 'required|max:255',
                'appointment_id' => 'required',
            ]);

            // Find the existing prescription
            $prescription = PatientPrescription::findOrFail($id);

            // Get or create medication
            if (!empty($validated['medication_id'])) {
                $medication = MedicationList::findOrFail($validated['medication_id']);
            } else {
                $medication = MedicationList::firstOrCreate(
                    ['name' => $validated['medication']],
                    [
                        'category' => 'General',
                        'price' => 0,
                        'quantity' => 0,
                        'controlled' => false,
                    ]
                );
            }

            // Get or create frequency
            if (!empty($validated['frequency_id'])) {
                $frequency = FrequencyList::findOrFail($validated['frequency_id']);
            } else {
                $frequency = FrequencyList::firstOrCreate(['name' => $validated['frequency']]);
            }

            // Update prescription
            $prescription->update([
                'patient_id' => $validated['patient_id'],
                'doctor_id' => Auth::id(),
                'medication_id' => $medication->id,
                'dosage' => $validated['dosage'],
                'frequency_id' => $frequency->id,
                'amount' => $validated['amount'],
                'quantity' => $validated['amount'],
                'duration' => $validated['duration'],
                'appointment_id' => $validated['appointment_id'],
            ]);

            return back()->with('success', 'Prescription updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }


    public function patientprescription_remove($id)
    {
        try {
            PatientPrescription::destroy($id);
            return back()->with('success', 'Prescription removed successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function update_status($id, $app_id, Request $request)
    {
        $data = $request->all();
        $user = Auth::user();
        if ($user->role !== 'doctor' && $user->role !== 'admin') {
            // return response()->withe
            return back()->withErrors(['error' => 'Unauthorized. Only doctors can perform this action.']);
        }
        $did = $user->id;
        $record = MedicalRecord::where('patient_id', $id)
            ->where('closed_appointment_id', $app_id)
            ->first();
        if (!$record) {
            return back()->withErrors(['error' => 'Medical record not found.']);
        }
        $record->status = $data['status'];
        $record->doctor_id = $did;
        $record->save();


        return back()->with('success', 'Medical record status updated to modify.');
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
            'note' => 'required|string|max:1000',
            'appointment_id' => 'required'
        ]);

        $note = $request->note;

        // Step 1: Update existing note if found, or create a new one
        $patientNote = PatientNotes::updateOrCreate(
            [
                'patient_id' => $request->patient_id,
                'note' => $note,
                'appointment_id' => $request->appointment_id,
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
}
