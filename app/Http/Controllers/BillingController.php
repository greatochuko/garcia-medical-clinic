<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UnfinishedDoc;
use App\Models\Billing;
use App\Models\ServiceCharge;
use App\Models\MedicalRecord;
use App\Models\Appointment;
use App\Models\InventoryChange;
use App\Models\MedicationList;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BillingController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);

        $query = Billing::query();

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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient' => 'required|array',
            'service' => 'required|array',
            'prescriptions' => 'nullable|array',
            'total' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'final_total' => 'required|numeric',
            'amount_paid' => 'required|numeric',
            'paid' => 'boolean',
            'appointment_id' => 'nullable|integer',
        ]);

        DB::beginTransaction();

        try {
            // Create billing record
            $billing = Billing::create($validated);

            // Update prescriptions/inventory logic
            if (!empty($validated['prescriptions'])) {
                foreach ($validated['prescriptions'] as $prescription) {
                    $medication = MedicationList::find($prescription['medication']['id']);

                    // Fail if medication not found
                    if (!$medication) {
                        throw new \Exception("Medication not found (ID: {$prescription['medication']['id']}).");
                    }

                    $quantity = $prescription['amount'];
                    $available = $medication->quantity;

                    // Fail if requested amount exceeds available stock
                    if ($quantity > $available) {
                        throw new \Exception("Quantity for {$medication->name} exceeds available stock. Requested: {$quantity}, Available: {$available}.");
                    }

                    $newTotal = $available - $quantity;

                    // Update medication stock
                    $medication->update([
                        'quantity' => $newTotal,
                        'lastRunDate' => now(),
                    ]);

                    // Log inventory change
                    InventoryChange::create([
                        'medication_id' => $medication->id,
                        'user_id' => auth()->id(),
                        'lastRunDate' => now(),
                        'entryDetails' => 'Pull Out',
                        'quantity' => $quantity,
                        'expiryDate' => $prescription['expiryDate'] ?? null,
                        'newTotal' => $newTotal,
                    ]);
                }
            }

            // Mark appointment as checked out if applicable
            if (!empty($validated['appointment_id'])) {
                $appointment = Appointment::with('patient')->find($validated['appointment_id']);
                if ($appointment) {
                    $appointment->update(['status' => 'checked_out']);

                    $medicalRecord = MedicalRecord::where('appointment_id', $appointment->id)->first();
                    $receiverId = $medicalRecord?->doctor_id;

                    $transactionData = [
                        'billing_id' => $billing->id,
                        'appointment_id' => $appointment->id,
                        'patient_name' => trim(
                            $appointment->patient->first_name . ' ' .
                                ($appointment->patient->middle_initial ? $appointment->patient->middle_initial . '. ' : '') .
                                $appointment->patient->last_name
                        ),
                        'queue_type' => $appointment->queue_type,
                        'queue_number' => $appointment->queue_number,
                        'total' => $billing->final_total,
                        'amount_paid' => $billing->amount_paid,
                    ];

                    Log::info($transactionData);

                    ChatController::sendChatMessage(
                        $receiverId,
                        'transaction',
                        'New billing record created for your visit.',
                        $transactionData
                    );
                }
            }


            DB::commit();

            return response()->json([
                'success' => true,
                'billing' => $billing,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
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
