<?php

namespace App\Http\Controllers;

use App\Events\VitalsChanged;
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
        try {
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

            broadcast(new VitalsChanged($vitals, 'created'))->toOthers();

            return redirect()->back()->with('success', 'Vitals added successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function updatePatientVitals(Request $request, $id)
    {
        try {
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
                return back()->withErrors(['vitals' => 'Vitals not found for this patient.']);
            }

            $vitals->update($validated);

            broadcast(new VitalsChanged($vitals, 'updated'))->toOthers();

            return redirect()->back()->with('success', 'Vitals updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
