<?php

namespace App\Http\Controllers;

use App\Events\AppointmentCreated;
use App\Events\AppointmentUpdated;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\ClosedAppointment;
use App\Models\MedicalRecord;
use App\Models\MedicationList;
use App\Models\ServiceCharge;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AppointmentManagerController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('perPage', 10);
        $search = $request->input('search', '');
        $type = $request->input('type', '');

        $query = Appointment::with(['patient.vitals', 'serviceCharge']);
        if ($type === 'completed') {
            $query->where('status', 'checked_out');
        } else {
            $query->where('status', '!=', 'checked_out');
        }

        $medications = MedicationList::all();

        // Apply search filters
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('patient', function ($subQuery) use ($search) {
                    $subQuery->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhere('patient_id', 'like', "%{$search}%");
                })->orWhereHas('serviceCharge', function ($subQuery) use ($search) {
                    $subQuery->where('name', 'like', "%{$search}%");
                });
            });
        }

        // Fetch with pagination
        $appointments = $query->with('patientVisitRecord.patient', 'patientVisitRecord.doctor')
            ->orderBy('appointments.appointment_date', 'desc')
            ->paginate($perPage)
            ->withQueryString();


        $serviceTypes = ServiceCharge::select('id', 'name', 'charge', 'patient_type')
            ->get();

        return Inertia::render('AppointmentManager', [
            'appointments' => $appointments,
            'medications' => $medications,
            'serviceTypes' => $serviceTypes
        ]);
    }


    public function poll(Request $request)
    {
        return response()->json([
            'appointments' => $this->getAppointments($request)
        ]);
    }


    protected function getAppointments(Request $request)
    {
        $perPage = (int) $request->input('perPage', 10);
        $page = (int) $request->input('page', 1);
        $search = $request->input('search', '');

        $query = Appointment::with(['patient', 'serviceCharge'])
            ->whereDate('appointment_date', Carbon::today());

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('patient', function ($subQuery) use ($search) {
                    $subQuery->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('patient_id', 'like', "%{$search}%");
                })->orWhereHas('serviceCharge', function ($subQuery) use ($search) {
                    $subQuery->where('name', 'like', "%{$search}%");
                });
            });
        }

        $appointments = $query
            ->orderBy('appointments.order_number')
            ->paginate($perPage, ['*'], 'page', $page);

        $transformedData = $appointments->through(function ($appointment) {
            return [
                'id' => $appointment->id,
                'order_number' => $appointment->order_number,
                'queue_type' => $appointment->queue_type,
                'queue_number' => $appointment->queue_number,
                'patient' => [
                    'name' => $appointment->patient->first_name . ', ' . $appointment->patient->middle_initial . ' ' . $appointment->patient->last_name,
                    'age' => $appointment->patient->age,
                    'patient_id' => $appointment->patient->patient_id,
                    'gender' => $appointment->patient->gender
                ],
                // 'services' => [$appointment->serviceCharge->name ?? ''],
                'status' => $appointment->status,
                'actions' => ['Check In', 'Check Out']
            ];
        });

        return [
            'data' => $transformedData->items(),
            'current_page' => $appointments->currentPage(),
            'per_page' => $appointments->perPage(),
            'last_page' => $appointments->lastPage(),
            'total' => $appointments->total(),
            'prev_page_url' => $appointments->previousPageUrl(),
            'next_page_url' => $appointments->nextPageUrl(),
        ];
    }


    public function reorder(Request $request)
    {
        $reorderData = $request->input('reorderData');

        $draggedOrderNumber = $reorderData['draggedOrderNumber'];
        $replacedOrderNumber = $reorderData['replacedOrderNumber'];
        $direction = $reorderData['direction'];
        $min = min($draggedOrderNumber, $replacedOrderNumber);
        $max = max($draggedOrderNumber, $replacedOrderNumber);

        $between = Appointment::whereBetween('order_number', [$min, $max])->get();

        foreach ($between as $appointment) {

            if ($direction == 'up') {
                if ($appointment->order_number == $draggedOrderNumber) {
                    $appointment->order_number = $replacedOrderNumber;
                } else {
                    $appointment->order_number = $appointment->order_number + 1;
                }
            } else {
                if ($appointment->order_number == $draggedOrderNumber) {
                    $appointment->order_number = $replacedOrderNumber;
                } else {
                    $appointment->order_number = $appointment->order_number - 1;
                }
            }

            // $aaa[] = $appointment;

            $appointment->save();
        }
        // return response()->json($aaa);

        return response()->json([
            'message' => 'Appointment reordered successfully',
            'data' => $reorderData
        ]);
    }

    public function getQueueNumbers(Request $request, $age = null)
    {
        $queueTag = ($age >= 60) ? 'S' : 'R';
        $excludeDate = $request->query('date');

        if ($excludeDate && \Carbon\Carbon::parse($excludeDate)->isFuture()) {
            $takenQueueNumbers = $this->getQueueNumbersForDate($queueTag, $excludeDate);
        } else {
            $takenQueueNumbers = $this->getQueueNumbersForLast24Hours($queueTag);
        }

        $queueNumbers = [];
        $current = 1;

        while (count($queueNumbers) < 40) {
            if (!in_array($current, $takenQueueNumbers)) {
                $queueNumbers[] = [
                    'number' => sprintf('%s%d', $queueTag, $current),
                ];
            }
            $current++;
        }

        return response()->json($queueNumbers);
    }

    private function getQueueNumbersForLast24Hours($queueTag)
    {
        $cutoff = \Carbon\Carbon::now()->subHours(24);

        $fromAppointments = Appointment::where('queue_type', $queueTag)
            ->where('created_at', '>=', $cutoff)
            ->pluck('queue_number')
            ->map(fn($num) => (int) str_replace($queueTag, '', $num))
            ->toArray();

        $fromClosedAppointments = ClosedAppointment::where('queue_number', 'like', $queueTag . '%')
            ->where('created_at', '>=', $cutoff)
            ->pluck('queue_number')
            ->map(fn($num) => (int) str_replace($queueTag, '', $num))
            ->toArray();

        return array_unique(array_merge($fromAppointments, $fromClosedAppointments));
    }

    private function getQueueNumbersForDate($queueTag, $date)
    {
        return Appointment::where('queue_type', $queueTag)
            ->whereDate('appointment_date', '=', $date)
            ->pluck('queue_number')
            ->map(fn($num) => (int) str_replace($queueTag, '', $num))
            ->toArray();
    }

    public function selectPatient()
    {
        $patients = Patient::select('id', 'first_name', 'last_name', 'patient_id')->get();

        return Inertia::render('Appointments/SelectPatient', [
            'patients' => $patients,
        ]);
    }

    public function createAppointment(Request $request)
    {
        $patientData = Patient::where('patient_id', $request->query('id'))->first();

        if (!$patientData) {
            return redirect()->back()->withErrors(['id' => 'Invalid patient ID']);
        }

        $serviceTypes = ServiceCharge::select('id', 'name', 'charge', 'patient_type')
            ->where('patient_type', $patientData['age'] >= 60 ? 1 : 0)
            ->get();

        return Inertia::render('Appointments/CreateAppointment', [
            'serviceTypes' => $serviceTypes,
            'patientData' => $patientData,
            'patient' => [
                'age' => $patientData->age,
                'patient_id' => $patientData->patient_id,
                'name' => $patientData->first_name . ' ' . $patientData->last_name,
                'address' => $patientData->address
            ]
        ]);
    }

    public function createNewAppointment(Request $request)
    {
        $request->validate([
            'patient_id' => 'required',
            'appointment_date' => 'required|date',
            'service_type' => 'required|string|exists:service_charges,id',
            'status' => 'required',
            'queue_number' => 'required'
        ]);

        preg_match('/^([A-Z]+)(\d+)$/i', $request->queue_number, $matches);
        $queue_type = $matches[1];
        $queue_number = (int) $matches[2];

        try {
            $appointment = DB::transaction(function () use ($request, $queue_type, $queue_number) {
                $latestOrderNumber = DB::table('appointments')
                    ->lockForUpdate()
                    ->max('order_number') ?? 0;

                $newOrderNumber = $latestOrderNumber + 1;

                $exists = Appointment::where('queue_type', $queue_type)
                    ->where('queue_number', $queue_number)
                    ->where('appointment_date', $request->appointment_date)
                    ->exists();

                if ($exists) {
                    throw new \Exception('That queue number is already assigned for this date.');
                }

                $appointment = Appointment::create([
                    'order_number' => $newOrderNumber,
                    'patient_id' => $request->patient_id,
                    'appointment_date' => $request->appointment_date,
                    'service' => $request->service_type,
                    'status' => strtolower($request->status),
                    'queue_type' => $queue_type,
                    'queue_number' => $queue_number,
                ]);

                Patient::where('patient_id', $request->patient_id)->update([
                    'last_visit_date' => $request->appointment_date,
                ]);

                return $appointment;
            });

            $appointment->load(['patient.vitals', 'serviceCharge']);

            event(new AppointmentCreated($appointment));

            return redirect()
                ->route('appointments.index')
                ->with('success', 'Appointment created successfully');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['queue_number' => $e->getMessage()])
                ->withInput();
        }
    }


    public function closedAppointments(Request $request)
    {
        $search = $request->input('search', '');
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('perPage', 10);

        // Fetch all closed appointments with optional filtering
        $query = ClosedAppointment::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('queue_number', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('gender', 'like', "%{$search}%")
                    ->orWhere('age', 'like', "%{$search}%")
                    ->orWhere('service', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('patient_id', 'like', "%{$search}%");
            });
        }

        $appointments = $query->get()->map(function ($appointment) {
            return [
                'id' => $appointment->id,
                'queue_number' => $appointment->queue_number,
                'name' => $appointment->name,
                'age' => $appointment->age,
                'gender' => $appointment->gender,
                'service' => $appointment->service,
                'status' => $appointment->status,
            ];
        })->toArray();

        // Manual pagination
        $total = count($appointments);
        $lastPage = ceil($total / $perPage);
        $paginatedData = array_slice($appointments, ($page - 1) * $perPage, $perPage);

        return Inertia::render('ClosedAppointments', [
            'patient' => [
                'data' => $paginatedData,
                'current_page' => $page,
                'per_page' => $perPage,
                'last_page' => $lastPage,
                'total' => $total,
                'prev_page_url' => $page > 1 ? route('appointments.closed', ['page' => $page - 1, 'perPage' => $perPage, 'search' => $search]) : null,
                'next_page_url' => $page < $lastPage ? route('appointments.closed', ['page' => $page + 1, 'perPage' => $perPage, 'search' => $search]) : null,
            ],
            'auth' => [
                'user' => auth()->user(),
                'role' => auth()->user()->role ?? 'unknown',
            ],
        ]);


        // // Fetch all closed appointments from the database
        // $appointments = ClosedAppointment::all()->map(function ($appointment) {
        //     return [
        //         'id' => $appointment->id,
        //         'queue_number' => $appointment->queue_number,
        //         'name' => $appointment->name,
        //         'age' => $appointment->age,
        //         'gender' => $appointment->gender,
        //         'service' => $appointment->service,
        //         'status' => $appointment->status,
        //     ];
        // })->toArray();

        // // Manual pagination
        // $page = (int) $request->input('page', 1);
        // $perPage = (int) $request->input('perPage', 10);
        // $total = count($appointments);
        // $lastPage = ceil($total / $perPage);

        // $paginatedData = array_slice($appointments, ($page - 1) * $perPage, $perPage);

        // return Inertia::render('ClosedAppointments', [
        //     'patient' => [
        //         'data' => $paginatedData,
        //         'current_page' => $page,
        //         'per_page' => $perPage,
        //         'last_page' => $lastPage,
        //         'total' => $total,
        //         'prev_page_url' => $page > 1 ? route('appointments.closed', ['page' => $page - 1, 'perPage' => $perPage]) : null,
        //         'next_page_url' => $page < $lastPage ? route('appointments.closed', ['page' => $page + 1, 'perPage' => $perPage]) : null,
        //     ],
        //     'auth' => [
        //         'user' => auth()->user(),
        //         'role' => auth()->user()->role ?? 'unknown',
        //     ],
        // ]);
    }

    public function closeForm(Request $request, $id)
    {
        try {
            $user = auth()->user();

            // Role check
            if (!in_array($user->role, ['doctor', 'admin'])) {
                return back()->withErrors(['error' => 'Patient forms can only be closed ']);
            }

            // Find appointment
            $appointment = Appointment::find($id);
            if (!$appointment) {
                return back()->withErrors(['error' => 'Appointment not found']);
            }

            // Validate request data
            $validated = $request->validate(
                [
                    'diagnosis' => 'nullable|string|max:1000',
                    'prescribed_medications' => 'nullable|array',
                    'prescribed_medications.*' => 'string|max:255',
                ],
                [
                    // 'diagnosis.required'         => 'A medical certificate is required before closing the form.',
                    'diagnosis.string' => 'The diagnosis must be a valid text.',
                    'diagnosis.max' => 'The diagnosis cannot exceed 1000 characters.',

                    // 'prescribed_medications.required'   => 'Prescribed medications are required before closing the form.',
                    'prescribed_medications.array' => 'Prescribed medications must be a valid list.',
                    'prescribed_medications.*.string' => 'Each medication must be a valid text.',
                    'prescribed_medications.*.max' => 'Each medication cannot exceed 255 characters.',
                ]
            );


            // Update appointment status
            $appointment->status = "for_billing";

            // Create medical record
            MedicalRecord::create([
                'appointment_id' => $appointment->id,
                'diagnosis' => $validated['diagnosis'] ?? "N/A",
                'prescribed_medications' => $validated['prescribed_medications'] ?? [],
                'doctor_id' => $user->id,
                'patient_id' => $appointment->patient_id,
            ]);

            $appointment->save();

            $appointment->load(['patient.vitals', 'serviceCharge']);

            broadcast(new AppointmentUpdated($appointment))->toOthers();

            return redirect()->route('appointments.index')
                ->with('success', 'Form closed and medical record created successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $appointment = Appointment::with(['patient.vitals', 'serviceCharge'])->find($id);

        if (!$appointment) {
            return back()->withErrors(['error' => 'Appointment not found']);
        }

        $appointment->status = $request->status;
        $appointment->save();

        // Reload relations after update to ensure fresh data
        $appointment->load(['patient.vitals', 'serviceCharge']);

        broadcast(new AppointmentUpdated($appointment))->toOthers();

        return back()->with('success', 'Appointment status updated successfully.');
    }


    public function closedDelete($id)
    {
        $appointment = ClosedAppointment::find($id);
        $appointment->delete();
        return redirect()->back()->with('success', 'Appointment deleted successfully');
    }

    public function activeDelete($id)
    {
        try {
            $appointment = Appointment::findOrFail($id); // throws exception if not found
            $appointment->delete();

            return redirect()->back()->with('success', 'Appointment deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete appointment. Please try again.');
        }
    }



    public function checkOut($id)
    {
        try {
            $appointment = Appointment::with(['patient', 'serviceCharge'])
                ->where('id', $id)
                ->firstOrFail();

            // Example: maybe you want to mark it as checked out
            // $appointment->update(['status' => 'checked_out']);

            // dd($appointment);

            // Create closed appointment record
            ClosedAppointment::create([
                'patient_id' => $appointment->patient->patient_id,
                'appointment_id' => $appointment->id,
                'queue_number' => $appointment->queue_type . $appointment->queue_number,
                'name' => $appointment->patient->first_name . ', ' . $appointment->patient->middle_initial . ' ' . $appointment->patient->last_name,
                'age' => $appointment->patient->age,
                'gender' => $appointment->patient->gender,
                'service' => $appointment->serviceCharge->name,
                'status' => 'checked_out'
            ]);

            // Delete the original appointment
            $appointment->delete();

            return back()->with('success', 'Appointment checked out successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Appointment not found or an error occurred.');
        }
    }


    //     return redirect()->route('appointments.index')->with('success', 'Patient has been checked out successfully.');
    // }
}
