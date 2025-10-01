<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use App\Models\Patient;
use App\Models\PatientPrescription;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrescriptionController extends Controller
{
    public function print($id, $app_id): Response
    {
        // Get doctor_id
        $doctor_id = PatientPrescription::where('patient_id', $id)
            ->where('appointment_id', $app_id)
            ->value('doctor_id');

        if (!$doctor_id) {
            abort(404, 'Doctor not found for this prescription');
        }

        // Get doctor details
        $doctor = User::leftJoin('doctors', 'users.id', '=', 'doctors.user_id')
            ->where('users.id', $doctor_id)
            ->select('users.first_name as doctor_name', 'users.last_name as doctor_last_name', 'doctors.license_number', 'doctors.ptr_number')
            ->first();

        if (!$doctor) {
            abort(404, 'Doctor information not found');
        }

        // Get patient details
        $patient = Patient::where('patient_id', $id)->first();
        if (!$patient) {
            abort(404, 'Patient not found');
        }

        // Get medications
        $medications = PatientPrescription::where('patient_id', $id)
            ->where('appointment_id', $app_id)
            ->get();

        // if ($medications->isEmpty()) {
        //     abort(404, 'No prescriptions found');
        // }

        // Format prescription
        $prescription = [
            'patient_name' => $patient->first_name ?? 'N/A',
            'address' => $patient->address ?? 'N/A',
            'age' => $patient->age ?? 'N/A',
            'sex' => $patient->gender ?? 'N/A',
            'date' => now()->format('F j, Y'),
            'doctor_name' => ($doctor->doctor_name . ' ' . $doctor->doctor_last_name) ?? 'N/A',
            'license_no' => $doctor->license_number ?? 'N/A',
            'ptr_no' => $doctor->ptr_number ?? 'N/A',
            'medications' => $medications->map(function ($item) {
                return [
                    'name' => $item->medication ?? 'N/A',
                    'amount' => $item->amount,
                    'sig' => $item->frequency ?? 'N/A',
                    'quantity' => $item->dosage ?? 'N/A',
                ];
            })->toArray(),
        ];

        return Inertia::render('Prescriptions/Print', [
            'prescription' => $prescription
        ]);
    }
}
