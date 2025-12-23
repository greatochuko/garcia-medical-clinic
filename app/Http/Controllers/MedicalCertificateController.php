<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\MedicalCertificate;
use App\Models\Patient;
use App\Models\LaboratoryRequest;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class MedicalCertificateController extends Controller
{
    public function show($id, $app_id)
    {


        $result = DB::table('medical_certificate')
            ->leftJoin('patient_records', 'medical_certificate.patient_id', '=', 'patient_records.patient_id')
            ->leftJoin('users', 'medical_certificate.doctor_id', '=', 'users.id')
            ->leftJoin('doctors', 'users.id', '=', 'doctors.user_id')
            ->where('medical_certificate.patient_id', $id)
            ->where('medical_certificate.appointment_id', $app_id)
            ->select(
                'medical_certificate.*',
                'patient_records.first_name as patient_name',
                'patient_records.last_name as patient_last_name',
                'patient_records.age',
                'patient_records.gender as gender',
                'patient_records.address',
                'patient_records.last_visit_date',
                'users.first_name as doctor_name',
                'users.last_name as doctor_last_name',
                'doctors.license_number as doctor_license',
                'doctors.ptr_number as doctor_ptr'
            )
            ->first();

        //   print_r($result);exit();
        if (!$result) {
            return response()->json(['message' => 'No certificate found.'], 404);
        }

        $certificate = [
            'patient' => [
                'name' => $result->patient_name . $result->patient_last_name,
                'age' => $result->age,
                'gender' => $result->gender,
                'civilStatus' => $result->civilStatus,
                'address' => $result->address,
                'visitDate' => Carbon::createFromTimestamp($result->last_visit_date)->format('F j, Y'),
            ],
            'diagnosis' => $result->diagnosis,
            'comments' => $result->comments,
            'date' => Carbon::parse($result->created_at)->format('F j, Y'),
            'doctor' => [
                'name' => $result->doctor_name . $result->doctor_last_name,
                'licenseNo' => $result->doctor_license,
                'ptrNo' => $result->doctor_ptr,
            ],
        ];


        return Inertia::render('MedicalCertificate/MedicalCertificate', $certificate);
    }

    public function store_medical_certificate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|string',
            'civilStatus' => 'required|string|in:Married,Single,Widowed,Divorced',
            'diagnosis' => 'required|string|max:500',
            'comments' => 'required|string|max:1000',
            'appointment_id' => 'nullable',
            'patient_visit_record_id' => 'required'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        try {
            $existing = MedicalCertificate::where('patient_id', $data['patient_id'])
                ->where('appointment_id', $data['appointment_id'])
                ->first();

            if ($existing) {
                $existing->update([
                    'civilStatus' => $data['civilStatus'],
                    'diagnosis' => $data['diagnosis'],
                    'comments' => $data['comments'],
                    'appointment_id' => $data['appointment_id'],
                    'patient_visit_record_id' => $data['patient_visit_record_id'],
                    'doctor_id' => auth()->id(),
                ]);
            } else {
                MedicalCertificate::create([
                    'civilStatus' => $data['civilStatus'],
                    'diagnosis' => $data['diagnosis'],
                    'comments' => $data['comments'],
                    'patient_id' => $data['patient_id'],
                    'appointment_id' => $data['appointment_id'],
                    'patient_visit_record_id' => $data['patient_visit_record_id'],
                    'doctor_id' => auth()->id(),
                ]);
            }

            return redirect()->back()->with('success', 'Medical certificate saved successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'An error occurred while saving: ' . $e->getMessage());
        }
    }


    public function getinfo($id, $appointment_id)
    {
        try {
            $medical_certificate = DB::table('medical_certificate')
                ->join('patient_records', 'medical_certificate.patient_id', '=', 'patient_records.patient_id')
                ->where('medical_certificate.patient_id', $id)
                ->where('medical_certificate.appointment_id', $appointment_id)
                ->select('medical_certificate.*', 'patient_records.*')
                ->first();

            if (!$medical_certificate) {
                return response()->json(['message' => 'No record found.'], 404);
            }

            return response()->json($medical_certificate);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching the medical certificate information.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
