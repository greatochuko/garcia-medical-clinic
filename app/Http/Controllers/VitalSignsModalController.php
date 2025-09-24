<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\VitalSignsModal;
use Illuminate\Pagination\LengthAwarePaginator;

class VitalSignsModalController extends Controller
{
    public function index($id)
    {
        $patient_vital_modal = VitalSignsModal::where('patient_id', $id)->first();
        return $patient_vital_modal;
    }


    public function AddPatientVitals(Request $request)
    {
        $validated = $request->validate([
            'patient_id'               => 'required|integer|exists:patient_records,patient_id',
            'blood_diastolic_pressure' => 'nullable|integer|min:0',
            'blood_systolic_pressure'  => 'nullable|integer|min:0',
            'heart_rate'               => 'nullable|integer|min:0',
            'o2saturation'             => 'nullable|integer|min:0|max:100',
            'temperature'              => 'nullable|integer',
            'height_ft'                => 'nullable|integer|min:0',
            'height_in'                => 'nullable|integer|min:0|max:11',
            'weight'                   => 'nullable|integer|min:0',
        ]);

        $vitals = VitalSignsModal::create($validated);
        return;
    }


    public function updatePatientVitals(Request $request, $id)
    {
        $validated = $request->validate([
            'patient_id'               => 'required|integer|exists:patient_records,patient_id',
            'blood_diastolic_pressure' => 'nullable|integer|min:0',
            'blood_systolic_pressure'  => 'nullable|integer|min:0',
            'heart_rate'               => 'nullable|integer|min:0',
            'o2saturation'             => 'nullable|integer|min:0|max:100',
            'temperature'              => 'nullable|integer',
            'height_ft'                => 'nullable|integer|min:0',
            'height_in'                => 'nullable|integer|min:0|max:11',
            'weight'                   => 'nullable|integer|min:0',
        ]);

        $vitals = VitalSignsModal::find($id);

        if (!$vitals) {
            return response()->json(['message' => 'Vitals not found for this patient.'], 404);
        }


        // Update the vitals
        $vitals->update($validated);

        return;

        // return response()->json(['message' => 'Vitals updated successfully.', 'data' => $vitals], 200);
    }
}
