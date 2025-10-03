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
            'patient_id'               => 'required|numeric|exists:patient_records,patient_id',
            'blood_diastolic_pressure' => 'nullable|numeric|min:0',
            'blood_systolic_pressure'  => 'nullable|numeric|min:0',
            'heart_rate'               => 'nullable|numeric|min:0',
            'o2saturation'             => 'nullable|numeric|min:0|max:100',
            'temperature'              => 'nullable|numeric|min:0',
            'height_ft'                => 'nullable|numeric|min:0',
            'height_in'                => 'nullable|numeric|min:0|max:11',
            'weight'                   => 'nullable|numeric|min:0',
        ]);

        $vitals = VitalSignsModal::create($validated);
        return redirect()->back()->with('success', 'Vitals updated successfully.');
    }



    public function updatePatientVitals(Request $request, $id)
    {
        $validated = $request->validate([
            'patient_id'               => 'required|numeric|exists:patient_records,patient_id',
            'blood_diastolic_pressure' => 'nullable|numeric|min:0',
            'blood_systolic_pressure'  => 'nullable|numeric|min:0',
            'heart_rate'               => 'nullable|numeric|min:0',
            'o2saturation'             => 'nullable|numeric|min:0|max:100',
            'temperature'              => 'nullable|numeric',
            'height_ft'                => 'nullable|numeric|min:0',
            'height_in'                => 'nullable|numeric|min:0|max:11',
            'weight'                   => 'nullable|numeric|min:0',
        ]);

        $vitals = VitalSignsModal::find($id);

        if (!$vitals) {
            return back()->withErrors([
                'vitals' => 'Vitals not found for this patient.',
            ]);
        }


        // Update the vitals
        $vitals->update($validated);

        return redirect()->back()->with('success', 'Vitals updated successfully.');
    }
}
