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
use Illuminate\Support\Facades\Auth;

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
                'patient_records.first_name as patient_first_name',
                'patient_records.middle_initial as patient_middle_initial',
                'patient_records.last_name as patient_last_name',
                'patient_records.age',
                'patient_records.gender as gender',
                'patient_records.address',
                'patient_records.last_visit_date',
                'users.first_name as doctor_first_name',
                'users.middle_initial as doctor_middle_initial',
                'users.last_name as doctor_last_name',
                'doctors.license_number as doctor_license',
                'doctors.ptr_number as doctor_ptr'
            )
            ->first();

        //   print_r($result);exit();
        if (!$result) {
            return response()->json(['message' => 'No certificate found.'], 404);
        }

        $patientName = trim(collect([
            $result->patient_first_name,
            $result->patient_middle_initial ? $result->patient_middle_initial . '.' : null,
            $result->patient_last_name,
        ])->filter()->implode(' ')) ?: 'N/A';

        $doctorName = trim(collect([
            $result->doctor_first_name,
            $result->doctor_middle_initial ? $result->doctor_middle_initial . '.' : null,
            $result->doctor_last_name,
        ])->filter()->implode(' ')) ?: 'N/A';

        $certificate = [
            'patient' => [
                'name' => $patientName,
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
                'name' => $doctorName,
                'licenseNo' => $result->doctor_license,
                'ptrNo' => $result->doctor_ptr,
            ],
        ];



        return Inertia::render('MedicalCertificate/Print', $certificate);
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

        $appointmentId = $data['appointment_id'] ?? null;

        try {
            $existing = MedicalCertificate::where('patient_id', $data['patient_id'])
                ->where('appointment_id', $appointmentId)
                ->first();

            if ($existing) {
                $existing->update([
                    'civilStatus' => $data['civilStatus'],
                    'diagnosis' => $data['diagnosis'],
                    'comments' => $data['comments'],
                    'appointment_id' => $appointmentId,
                    'patient_visit_record_id' => $data['patient_visit_record_id'],
                    'doctor_id' => auth()->id(),
                ]);
            } else {
                MedicalCertificate::create([
                    'civilStatus' => $data['civilStatus'],
                    'diagnosis' => $data['diagnosis'],
                    'comments' => $data['comments'],
                    'patient_id' => $data['patient_id'],
                    'appointment_id' => $appointmentId,
                    'patient_visit_record_id' => $data['patient_visit_record_id'],
                    'doctor_id' => auth()->id(),
                ]);
            }

            return redirect()->back()->with('success', 'Medical certificate saved successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'error' => 'Something went wrong while saving medical certificate.',
                'errorMessage' => $e->getMessage(),
            ]);
        }
    }

    public function delete_medical_certificate(Request $request, $appointment_id)
    {
        try {
            $user = Auth::user();

            // Fetch all certificates for this appointment
            $certificates = MedicalCertificate::where('appointment_id', $appointment_id)->get();

            if ($certificates->isEmpty()) {
                return redirect()->back()->withErrors([
                    'error' => 'No medical certificate found for this appointment.',
                ]);
            }

            if ($user->role !== 'doctor' && $user->role !== 'admin') {
                return redirect()->back()->withErrors([
                    'error' => 'You are not authorized to delete this medical certificate.',
                ]);
            }

            // Delete allowed certificates
            MedicalCertificate::whereIn('id', $certificates->pluck('id'))->delete();

            return redirect()->back()->with('success', 'Medical certificate deleted successfully.');
        } catch (\Throwable $e) {
            report($e);

            return redirect()->back()->withErrors([
                'error' => 'Something went wrong while deleting medical certificate.',
                'errorMessage' => $e->getMessage(),
            ]);
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
