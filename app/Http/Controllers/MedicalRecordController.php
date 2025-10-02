<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Support\Facades\DB;
use App\Models\MedicalHistory;
use App\Models\MedicalRecord;
use App\Models\MedicationList;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicalRecordController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('perPage', 10);
        $page = (int) $request->input('page', 1);
        $search = $request->input('search', '');

        $query = Patient::select(
            'id',
            'patient_id',
            'first_name',
            'last_name',
            'charge',
            'patient_type',
            'last_visit_date',
            'age',
            'gender'
        )
            ->orderBy('created_at', 'desc'); // newest first


        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('patient_id', 'like', "%{$search}%")
                    ->orWhere('patient_type', 'like', "%{$search}%")
                    ->orWhere('gender', 'like', "%{$search}%")
                    ->orWhereRaw("FROM_UNIXTIME(last_visit_date, '%M %d, %Y') LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("FROM_UNIXTIME(last_visit_date, '%Y-%m-%d') LIKE ?", ["%{$search}%"]);
            });
        }

        // Paginate result
        $patients = $query->paginate($perPage, ['*'], 'page', $page);

        // Transform data
        $patients->getCollection()->transform(function ($patient) {
            return [
                'id' => $patient->id,
                'patient_id' => $patient->patient_id,
                'name' => $patient->first_name . ' ' . $patient->last_name,
                'charge' => number_format($patient->charge, 2),
                'patient_type' => $patient->patient_type,
                'last_visit_date' => $patient->last_visit_date,
                'age' => $patient->age,
                'gender' => $patient->gender
            ];
        });

        return Inertia::render('MedicalRecords/MedicalRecords', ["patientData" => $patients]);
    }

    public function view($id)
    {
        $patient = Patient::with(["appointments", "vitals"])->where('id', $id)->first();
        if (!$patient) {
            abort(404, 'Patient not found.');
        }
        $medicalRecords = MedicalRecord::with(['appointment.serviceCharge', 'doctor', 'patient'])->where('patient_id', $patient['patient_id'])->get();
        $medicalHistory = MedicalHistory::where('patient_id', $patient['patient_id']);
        $medications = MedicationList::all();

        return Inertia::render('MedicalRecords/ViewMedicalRecord', [
            'patient' => $patient,
            'medicalRecords' => $medicalRecords,
            'medications' => $medications,
            'medicalHistory' => $medicalHistory,
            'totalappointments' => 5
        ]);
    }

    public function deletePatient($id)
    {
        try {
            $appointment = Patient::findOrFail($id); // throws exception if not found
            $appointment->delete();

            return redirect()->back()->with('success', 'Patient record deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('error', 'Failed to delete patient record. Please try again.');
        }
    }

    public function view2($id)
    {
        // \Log::info('MedicalRecordController::view called with ID: ' . $id);
        $patient = Patient::where('id', $id)->first();
        $medicalhistory = MedicalHistory::where('patient_id', $patient['patient_id'])
            ->pluck('disease') // Only get the 'disease' column
            ->toArray();       // Convert collection to array
        $diseases = implode(', ', $medicalhistory); // Join with comma and space

        // $medicalRecords = MedicalRecord::where('patient_id' , $id);


        // print_r($medicalRecords);exit();
        // Dummy patient data
        $patient = [
            'id' => $id,
            'fullName' => $patient['first_name'] . $patient['last_name'],
            'age' =>  $patient['age'],
            'gender' => $patient['gender'],
            'patient_id' => $patient['patient_id'],
            'dateOfBirth' => $patient['dob'],
            'mobileNumber' => $patient['phone'],
            'address' => $patient['address'],
            'medicalHistory' => $diseases
        ];

        $medicalRecords_data = DB::table('medical_records')
            ->leftJoin('closed_appointments', 'closed_appointments.appointment_id', '=', 'medical_records.closed_appointment_id')
            ->leftJoin('appointments', 'appointments.id', '=', 'medical_records.closed_appointment_id')
            ->join('users', 'users.id', '=', 'medical_records.doctor_id')
            ->where('medical_records.patient_id', $patient['patient_id'])
            ->where('medical_records.status', 'closed')
            ->select(
                'medical_records.date',
                'medical_records.patient_id as patient_id',
                'medical_records.has_document',
                'medical_records.status',
                'users.first_name as doctor_first_name',
                'users.last_name as doctor_last_name',
                'closed_appointments.queue_number',
                DB::raw('COALESCE(closed_appointments.appointment_id, appointments.id) as appointment_id'),
                'closed_appointments.name',
                'closed_appointments.age',
                'closed_appointments.gender',
                'closed_appointments.service',
                'closed_appointments.status as appointment_status',
                'closed_appointments.created_at as appointment_created_at',
                'users.email as doctor_email'
            )
            ->get();

        // Loop and attach diagnoses to each record
        foreach ($medicalRecords_data as $record) {
            $diagnoses = DB::table('patient_diagnoses')
                ->where('appointment_id', $record->appointment_id)
                ->pluck('diagnosis') // get only diagnosis column
                ->toArray();

            $record->diagnoses = implode(', ', $diagnoses); // comma-separated string
        }


        // Convert data to array in same format as dummy example
        $medicalRecords = $medicalRecords_data->map(function ($record) {
            return [
                'date' => \Carbon\Carbon::parse($record->date)->format('F j, Y'),
                'diagnosis' => $record->diagnoses,
                'appointment_id' => $record->appointment_id,
                'patient_id' => $record->patient_id,
                'hasDocument' => (bool) $record->has_document,
                'status' => $record->status,
                'service' => $record->service,
                'doctor' => 'DR. ' . strtoupper($record->doctor_first_name . ' ' . $record->doctor_last_name),
            ];
        })->toArray();

        $totalAppointments = DB::table('closed_appointments')
            ->where('patient_id', $patient['patient_id'])
            ->count();

        // \Log::info('Rendering view with patient data:', [
        //     'patient' => $patient,
        //     'medicalRecords' => $medicalRecords
        // ]);

        return Inertia::render('MedicalRecords/ViewMedicalRecord', [
            'patient' => $patient,
            'medicalRecords' => $medicalRecords,
            'totalappointments' => $totalAppointments
        ]);
    }

    public function get_patient_medical_record($id, $appointment_id)
    {
        $medicalRecords = DB::table('patient_diagnoses')
            ->join('medical_records', 'patient_diagnoses.appointment_id', '=', 'medical_records.closed_appointment_id')
            ->join('users', 'medical_records.doctor_id', '=', 'users.id')
            ->select(
                'medical_records.date as date',
                'medical_records.status as medical_status',
                'medical_records.notes as medical_notes',
                'users.first_name as doctor_first_name',
                'users.last_name as doctor_last_name',
                DB::raw('GROUP_CONCAT(patient_diagnoses.diagnosis SEPARATOR ", ") as diagnosis')
            )
            ->where('patient_diagnoses.patient_id', $id)
            ->groupBy(
                'medical_records.date',
                'medical_records.status',
                'medical_records.notes',
                'users.first_name',
                'users.last_name'
            )
            ->get();

        return $medicalRecords;
    }
}
