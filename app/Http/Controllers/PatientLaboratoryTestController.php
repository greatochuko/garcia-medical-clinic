<?php

namespace App\Http\Controllers;

use App\Models\PatientLaboratoryTest;
use App\Models\LaboratoryTest;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;



class PatientLaboratoryTestController extends Controller
{
    public function getTestOptions()
    {



        $tests = LaboratoryTest::orderBy("name")->pluck('name')->toArray();

        return response()->json([
            'tests' => $tests
        ]);

        // $patientLaboratory = PatientLaboratoryTest::orderBy("name")->get();
        // // Dummy data for test options
        // return response()->json([
        //     'tests' => [
        //         'Potassium',
        //         'Sodium',
        //         'Chloride',
        //         'Bicarbonate',
        //         'BUN',
        //         'Creatinine',
        //         'Glucose',
        //         'Calcium',
        //         'SUA'
        //     ]
        // ]);
        
    }

    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'patient_id' => 'required',
    //         'test_name' => 'required|string',
    //         'result_value' => 'required|numeric',
    //     ]);
    //     // return response()->json($request->all());


    //     $test = PatientLaboratoryTest::create([
    //         'patient_id' => $validated['patient_id'],
    //         'test_name' => $validated['test_name'],
    //         'result_value' => $validated['result_value'],
    //         'test_date' => Carbon::now()
    //     ]);

    //     return response()->json(['success' => true, 'test' => $test]);
    // }

public function store(Request $request)
{
    $validated = $request->validate([
        'patient_id' => 'required',
        'test_name' => 'required|string',
        'result_value' => 'required|numeric',
        'appointment_id' => 'required',
    ]);

    // Check if test_name exists in laboratory_tests
    $existingTest = LaboratoryTest::where('name', $validated['test_name'])->first();

    if (!$existingTest) {
        // Save it into laboratory_tests if not exists
        LaboratoryTest::create([
            'name' => $validated['test_name']
        ]);
    }

    // Save to patient laboratory tests
    $test = PatientLaboratoryTest::create([
        'patient_id' => $validated['patient_id'],
        'test_name' => $validated['test_name'],
        'result_value' => $validated['result_value'],
        'appointment_id' => $validated['appointment_id'],
        'test_date' => Carbon::now()
    ]);

    return response()->json(['success' => true, 'test' => $test]);
}

public function getPatientTests($patientId, $app_id)
{
    $tests = PatientLaboratoryTest::where('patient_id', $patientId)
        ->where('appointment_id', $app_id)
        ->orderBy('test_date', 'desc')
        ->get();

    // Collect unique dates
    $dates = $tests->pluck('test_date')->unique()->sortByDesc(function ($date) {
        return $date->timestamp;
    })->values();

    // Group by test_name
    $groupedTests = [];

    foreach ($tests as $test) {
        $formattedDate = $test->test_date->format('n/j/Y');

        if (!isset($groupedTests[$test->test_name])) {
            $groupedTests[$test->test_name] = [
                'test_name' => $test->test_name,
                'values' => []
            ];
        }

        $groupedTests[$test->test_name]['values'][$formattedDate] = $test->result_value;
    }

    return response()->json([
        'tests' => array_values($groupedTests),
        'dates' => $dates->map(fn($date) => $date->format('n/j/Y'))
    ]);
}

public function updatePatientTests($id , $pid)
{
    $data = request()->all();

    // Step 1: Update result_value where both test_name and test_date match
    foreach ($data['result_values'] as $date => $value) {
        PatientLaboratoryTest::where('test_name', $id)
            ->where('test_date', $date)
            ->where('patient_id' , $pid)
            ->update(['result_value' => $value]);
    }

    // Step 2: Update test_name if changed
    if (!empty($data['test_name']) && $data['test_name'] !== $id) {
        PatientLaboratoryTest::where('test_name', $id)
            ->update(['test_name' => $data['test_name']]);
    }
}



} 