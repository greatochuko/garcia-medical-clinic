<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\UnfinishedDoc;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\User;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class UnfinishedDocsController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('perPage', 10);
        $page = (int) $request->input('page', 1);
        $search = $request->input('search', '');
        
        // Query unfinished docs with status = 0 (unfinished)
        $query = UnfinishedDoc::where('status', 0);
        
        // Apply search if provided
        if ($search) {
            $query->whereHas('patient', function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('patient_id', 'like', "%{$search}%");
            });
        }
        
        // Get paginated results
        $unfinishedDocs = $query->paginate($perPage, ['*'], 'page', $page);
        
        // Transform the data to match the expected format
        $formattedDocs = $unfinishedDocs->through(function ($doc) {
            $patient = Patient::where('patient_id', $doc->patient_id)->first();
            $doctorDetails = User::where('id', $doc->doctor_id)->first();
        // $appointment_id = Appointment::where('patient_id', $doc->patient_id )->first();

            
            return [
                'id' => $doc->id,
                'patient_id' => $patient? $patient->patient_id : '',
                'patient_name' => $patient ? $patient->last_name . ', ' . $patient->first_name : 'Unknown',
                'age' => $patient ? $patient->age : '',
                'gender' => $patient ? $patient->gender : '',
                'mobile_number' => $patient ? $patient->phone : '',
                'appointment_date' => $doc->appointment_date,
                'doctor_name' => $doctorDetails?->first_name . ' ' . $doctorDetails?->last_name ?? 'N/A', 
                'status' => 'In Progress',
                'status_style' => 'outline',
                'appointment_id' => $doc->appointment_id,
            ];
        });
        
        return Inertia::render('MedicalRecords/UnfinishedDocs', [
            'docs' => $formattedDocs
        ]);
    }
    
    public function store(Request $request)
    {
        // Check if user is authenticated and is a doctor
        // if (!Auth::check() || !Auth::user()->isDoctor()) {
        //     return response()->json(['message' => 'Unauthorized. Only doctors can perform this action.'], 403);
        // }
        
        $request->validate([
            'patient_id' => 'required',
            'appointment_id' => 'nullable',
            'appointment_date' => 'required|date',
            'status' => 'required|integer'
        ]);
        // if($request->status == 1){
        //  $medical_record = MedicalRecord::where('patient_id' , $request->patient_id)->where('closed_appointment_id' , $request->appointment_id)->update(['doctor_id' => $request->doctor_id , 'status' => 'closed']);
        // }
        // Check if a record already exists for this patient and doctor
        $existingDoc = UnfinishedDoc::where('patient_id', $request->patient_id)
            ->where('appointment_id', $request->appointment_id)
            ->first();
            
        if ($existingDoc) {
            // Don't downgrade status from completed (1) to unfinished (0)
          
            // Update existing record
            $existingDoc->update([
                'status' => $request->status
            ]);
            
      
            return response()->json([
                'message' => 'Unfinished document updated successfully',
                'id' => $existingDoc->id
            ]);
        }
        
        // Create new record
        $unfinishedDoc = UnfinishedDoc::create([
            'patient_id' => $request->patient_id,
            'doctor_id' => $request->doctor_id,
            'appointment_id' => $request->appointment_id,
            'appointment_date' => $request->appointment_date,
            'status' => $request->status
        ]);
        
        return response()->json([
            'message' => 'Unfinished document created successfully',
            'id' => $unfinishedDoc->id
        ]);
    }
}