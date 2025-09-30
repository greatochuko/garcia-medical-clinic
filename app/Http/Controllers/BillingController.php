<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UnfinishedDoc;
use App\Models\Billing;
use App\Models\ServiceCharge;
use App\Models\MedicalRecord;
use App\Models\Appointment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class BillingController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);

        $query = Billing::with('patient', 'appointment.serviceCharge');

        if ($search) {
            $query->whereHas('patient', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('gender', 'like', "%{$search}%")
                    ->orWhere('patient_id', 'like', "%{$search}%");
            });
        }

        $billings = $query
            ->orderBy('created_at', 'desc') // newest first
            ->paginate($perPage)
            ->appends(['search' => $search]);

        return Inertia::render('BillingRecord', [
            'billingData' => $billings
        ]);
    }


    public function index2(Request $request)
    {

        $search = $request->input('search', '');
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        // Base query with eager loading
        $query = Billing::with('patient');

        // Apply search filter
        if ($search) {
            $query->whereHas('patient', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('gender', 'like', "%{$search}%")
                    ->orWhere('patient_id', 'like', "%{$search}%");
            });
        }

        // Get the full result set (will be paginated manually below)
        $billings = $query;
        // $billings = $query->get()->map(function ($billing) {
        //     // Handle services field
        //     $services = $billing->services;
        //     if (is_string($services)) {
        //         $services = json_decode($services, true);
        //     }

        //     $serviceString = '';
        //     if (is_array($services)) {
        //         $serviceString = implode(' + ', array_map(function ($service) {
        //             return is_array($service) ? $service['name'] : $service;
        //         }, $services));
        //     } else {
        //         $serviceString = $services ?? '';
        //     }

        //     return [
        //         'id' => $billing->id,
        //         'patient_id' => $billing->patient_id,
        //         'name' => $billing->patient ? $billing->patient->first_name . ' ' . $billing->patient->last_name : 'N/A',
        //         'age' => $billing->patient ? $billing->patient->age : 'N/A',
        //         'gender' => $billing->patient ? $billing->patient->gender : 'N/A',
        //         'service' => $serviceString,
        //         'total' => $billing->total,
        //         'final_total' => $billing->final_total,
        //         'paid' => $billing->paid == 1 ? 'true' : 'false',
        //     ];
        // });

        // Handle pagination manually
        $total = $billings->count();
        $lastPage = ceil($total / $perPage);
        $paginatedData = $billings->slice(($page - 1) * $perPage, $perPage)->values();

        return Inertia::render('BillingRecord', [
            'patientData' => [
                'data' => $paginatedData,
                'current_page' => $page,
                'per_page' => $perPage,
                'last_page' => $lastPage,
                'total' => $total,
                'prev_page_url' => $page > 1 ? route('billingrecord', ['page' => $page - 1, 'perPage' => $perPage, 'search' => $search]) : null,
                'next_page_url' => $page < $lastPage ? route('billingrecord', ['page' => $page + 1, 'perPage' => $perPage, 'search' => $search]) : null,
            ]
        ]);



        // $patients = Billing::with('patient')->get()->map(function ($billing) {
        //     // Handle services data properly
        //     $services = $billing->services;
        //     if (is_string($services)) {
        //         $services = json_decode($services, true);
        //     }

        //     // Ensure we have an array and convert to string
        //     $serviceString = '';
        //     if (is_array($services)) {
        //         $serviceString = implode(' + ', array_map(function($service) {
        //             return is_array($service) ? $service['name'] : $service;
        //         }, $services));
        //     } else {
        //         $serviceString = $services ?? '';
        //     }

        //     return [
        //         'id' => $billing->id,
        //         'patient_id' => $billing->patient_id,
        //         'name' => $billing->patient ? $billing->patient->first_name . ' ' . $billing->patient->last_name : 'N/A',
        //         'age' => $billing->patient ? $billing->patient->age : 'N/A',
        //         'gender' => $billing->patient ? $billing->patient->gender : 'N/A',
        //         'service' => $serviceString,
        //         'total' => $billing->total,
        //         'paid' => $billing->paid == 1 ? 'true' : 'false',

        //     ];
        // })->toArray();

        //     // Handle pagination
        //     $page = $request->input('page', 1);
        //     $perPage = $request->input('perPage', 10);
        //     $total = count($patients);
        //     $lastPage = ceil($total / $perPage);

        //     $paginatedData = array_slice($patients, ($page - 1) * $perPage, $perPage);

        //     return Inertia::render('BillingRecord', [
        //         'patient' => [
        //             'data' => $paginatedData,
        //             'current_page' => $page,
        //             'per_page' => $perPage,
        //             'last_page' => $lastPage,
        //             'total' => $total,
        //             'prev_page_url' => $page > 1 ? route('billingrecord', ['page' => $page - 1, 'perPage' => $perPage]) : null,
        //             'next_page_url' => $page < $lastPage ? route('billingrecord', ['page' => $page + 1, 'perPage' => $perPage]) : null,
        //         ]
        //     ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required',
            'appointment_id' => 'required|string',
            'services' => 'required|string', // or 'array' if you use JSON
            'total' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'final_total' => 'required|numeric',
            'paid' => 'boolean'
        ]);

        DB::beginTransaction();

        try {
            $billing = Billing::create($validated);

            $appointment = Appointment::findOrFail($validated['appointment_id']);
            $appointment->update(['status' => 'checked_out']);

            DB::commit();

            return response()->json([
                'success' => true,
                'billing' => $billing,
                'appointment' => $appointment
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function edit($id)
    {
        $billing = Billing::where('id', $id)->where('status', 0)->firstOrFail();
        return response()->json(['billing' => $billing]);
    }

    public function update(Request $request, $id)
    {
        $billing = Billing::findOrFail($id);

        $validated = $request->validate([
            'services' => 'required|string', // or 'array' if you use JSON
            'total' => 'required|numeric',
            'discount' => 'nullable',
            'final_total' => 'required|numeric',
            'paid' => 'boolean',
            // 'appointment_id' => 'required'
        ]);

        $appointment = Appointment::find($request->appointment_id);
        if ($request->has('status')) {
            $medical_record = MedicalRecord::where('patient_id', $request->patient_id)->where('closed_appointment_id', $request->appointment_id)->update(['doctor_id' => auth()->user()->id, 'status' => $request->status]);
            if ($request->status == 'closed') {
                $unfinishedDoc = UnfinishedDoc::updateOrCreate(
                    [
                        'patient_id' => $request->patient_id,
                        'appointment_id' => $request->appointment_id,
                    ],
                    [
                        'appointment_id' => $request->appointment_id,
                        'doctor_id' => Auth::user()->id,
                        'appointment_date' => $appointment->appointment_date,
                        'status' => '1'
                    ]
                );
            } else if ($request->status == 'open') {
                $unfinishedDoc = UnfinishedDoc::updateOrCreate(
                    [
                        'patient_id' => $request->patient_id,
                        'appointment_id' => $request->appointment_id,
                    ],
                    [
                        'appointment_id' => $request->appointment_id,
                        'appointment_date' => $appointment->appointment_date,
                        'doctor_id' => Auth::user()->id,
                        'status' => '0'
                    ]
                );
            }
            $billing->update($validated);
        } else {
            $medical_record = MedicalRecord::where('patient_id', $request->patient_id)->where('closed_appointment_id', $request->appointment_id)->first();
            if ($medical_record) {
                $status = $medical_record->status;
                if ($status != 'closed') {
                    MedicalRecord::where('patient_id', $request->patient_id)->where('closed_appointment_id', $request->appointment_id)->update(['status' => 'modify']);

                    $unfinish = UnfinishedDoc::where('patient_id',  $request->patient_id)->where('appointment_id', $request->appointment_id)->first();
                    if (!$unfinish) {
                        $unfinishedDoc = UnfinishedDoc::create([
                            'patient_id' => $request->patient_id,
                            'appointment_id' => $request->appointment_id,
                            'appointment_date' => $appointment->appointment_date,
                            'status' => '0'
                        ]);
                    } else {
                        $unfinishedDoc = UnfinishedDoc::updateOrCreate(
                            [
                                'patient_id' => $request->patient_id,
                                'appointment_id' => $request->appointment_id,
                            ],
                            [
                                'appointment_id' => $request->appointment_id,
                                'appointment_date' => $appointment->appointment_date,
                                'status' => '0'
                            ]
                        );
                    }
                } else {
                    $unfinishedDoc = UnfinishedDoc::create([
                        'patient_id' => $request->patient_id,
                        'appointment_id' => $request->appointment_id,
                        'appointment_date' => $appointment->appointment_date,
                        'status' => 1
                    ]);
                }
            } else {
                $unfinishedDoc = UnfinishedDoc::updateOrCreate(
                    [
                        'patient_id' => $request->patient_id,
                        'appointment_id' => $request->appointment_id,
                    ],
                    [
                        'appointment_id' => $request->appointment_id,
                        'appointment_date' => $appointment->appointment_date,
                        'status' => '0'
                    ]
                );

                $record = MedicalRecord::create([
                    'doctor_id' => 0,
                    'patient_id' => $request->patient_id,
                    'closed_appointment_id' => $request->appointment_id,
                    'status' => 'modify',
                    'date' => now(),
                ]);
            }
            $billing->update($validated);
        }
        return response()->json(['success' => true, 'billing' => $billing]);
    }

    public function destroy($id)
    {
        $billing = Billing::findOrFail($id);
        $billing->delete();

        return redirect()->route('billing.index')->with('success', 'Billing record deleted successfully');
    }

    public function showByPatient($patient_id)
    {
        $billing = Billing::where('patient_id', $patient_id)->first();
        return response()->json(['billing' => $billing]);
    }


    public function getServices()
    {
        $servicesPrice = ServiceCharge::orderBy('name', 'asc')
            ->get(['id', 'name', 'charge']) // select only necessary columns
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'price' => $service->charge,
                ];
            });

        return response()->json($servicesPrice);
    }
}
