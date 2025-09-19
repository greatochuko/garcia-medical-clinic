<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Patient;
use Illuminate\Support\Facades\DB;

class AllPatientController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('perPage', 10);
        $page = (int) $request->input('page', 1);
        $search = $request->input('search', '');
    
        // Base query
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
        );
    
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
                'name' => $patient->first_name . ' ' . $patient->last_name,
                'charge' => number_format($patient->charge, 2),
                'patient_type' => $patient->patient_type,
                'last_visit_date' => $patient->last_visit_date,
                'age' => $patient->age,
                'gender' => $patient->gender
            ];
        });
    
        return Inertia::render('AllPatients', [
            'patient' => $patients,
            'auth' => [
                'user' => auth()->user(),
                'role' => auth()->user()->role
            ]
        ]);
        
        // $perPage = $request->input('perPage', 10);

        // $patients = Patient::select(
        //     'id',
        //     'first_name',
        //     'last_name',
        //     'charge',
        //     'patient_type',
        //     'last_visit_date',
        //     'age',
        //     'gender'
        // )->paginate($perPage);
    
        // $patients->getCollection()->transform(function ($patient) {
        //     return [
        //         'id' => $patient->id,
        //         'name' => $patient->first_name . ' ' . $patient->last_name,
        //         'charge' => number_format($patient->charge, 2),
        //         'patient_type' => $patient->patient_type,
        //         'last_visit_date' => $patient->last_visit_date,
        //         'age' => $patient->age,
        //         'gender' => $patient->gender
        //     ];
        // });
    
        // return Inertia::render('AllPatients', [
        //     'patient' => $patients,
        //     'auth' => [
        //         'user' => auth()->user(),
        //         'role' => auth()->user()->role
        //     ]
        // ]);
    }

    public function PatientAddform()
    {
        return Inertia::render('AllPatientsAddForm');
    }

    public function latest_id()
    {
        do {
            $randomId = rand(1000, 9999);
            $exists = DB::table('patient_records')->where('patient_id', $randomId)->exists();
        } while ($exists);
        return $randomId;
    }


    public function PatientAdd2(Request $request)
    {
        $data = $request->all();
        $patient = Patient::create($request->all());
        return redirect()->route('appointments.create')->with('success', 'Patient registered successfully!')->with('id', $patient->id);
    }

    public function PatientAdd(Request $request)
    {
        $validated = $request->validate([
            'patient_id'     => 'required|string|unique:patient_records,patient_id',
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'middle_initial' => 'nullable|string|max:10',
            'dob'            => 'required|date',
            'age'            => 'required',
            'gender'         => 'required',
            'patient_type'   => 'required|integer',
            'phone'          => 'required|string',
            'address'        => 'required|string|max:500',
        ]);

        $patient = Patient::create([
            'patient_id'     => $validated['patient_id'],
            'first_name'     => $validated['first_name'],
            'last_name'      => $validated['last_name'],
            'middle_initial' => $validated['middle_initial'],
            'dob'            => $validated['dob'],
            'age'            => $validated['age'],
            'gender'         => $validated['gender'],
            'patient_type'   => $validated['patient_type'],
            'phone'          => $validated['phone'],
            'address'        => $validated['address'],
        ]);

        return redirect()
            ->route('appointments.create', ['id' => $patient->id])
            ->with('success', 'Patient registered successfully!')
            ->with('id', ['id' => $validated['patient_id'], 'age' => $validated['age']]);
        // ->with('age', $patient->age);
    }


    public function edit(Request $request)
    {
        $patient = Patient::find($request->id);
        return Inertia::render('AllPatientsAddForm', ['patient' => $patient]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'patient_id'     => 'required|string|unique:patient_records,patient_id',
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'middle_initial' => 'nullable|string|max:10',
            'dob'            => 'required|date',
            'age'            => 'required|integer|min:0',
            'gender'         => 'required',
            'patient_type'   => 'required|integer',
            'phone'          => 'nullable|string|max:20',
            'address'        => 'nullable|string|max:500',
        ]);

        $patient = Patient::find($request->id);
        if (!$patient) {
            return redirect()->route('allpatients')->with('error', 'Patient not found!');
        }
        $patient->update([
            'patient_id'     => $validated['patient_id'],
            'first_name'     => $validated['first_name'],
            'last_name'      => $validated['last_name'],
            'middle_initial' => $validated['middle_initial'],
            'dob'            => $validated['dob'],
            'age'            => $validated['age'],
            'gender'         => $validated['gender'],
            'patient_type'   => $validated['patient_type'],
            'phone'          => $validated['phone'],
            'address'        => $validated['address'],
        ]);
        return redirect()->route('allpatients')->with('success', 'Patient updated successfully!');
    }

  public function destroy(Request $request)
{
    $patient = Patient::find($request->id);

    if ($patient) {
        DB::table('appointments')->where('patient_id', $patient->patient_id)->delete();
        $patient->delete();
        return redirect()->route('allpatients')->with('success', 'Patient and related appointments deleted successfully!');
    }

    return redirect()->route('allpatients')->with('error', 'Patient not found.');
}

}
