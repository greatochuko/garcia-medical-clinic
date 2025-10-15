<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Billing;
use App\Models\ClosedAppointment;
use App\Models\Doctor;
use App\Models\UnfinishedDoc;
use App\Models\Reminder;

class DashboardController extends Controller
{
    public function show()
    {
        $summary = $this->getSummary();
        $upcomingPatients = $this->getUpcomingPatients();
        $pendingProcedures = $this->getPendingProcedures();
        $nextPatient = $this->getNextPatientInLine();
        $calendarData = $this->getCalendarData();
        $billingItems = $this->getBillingItems();
        // $queueData = $this->getQueueNumber();
        // $reminders = $this->getReminders();
        // $todayActivities = $this->getTodayActivities();


        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'summary' => $summary,
            'upcomingPatients' => $upcomingPatients,
            'pendingProcedures' => $pendingProcedures,
            'nextPatient' => $nextPatient,
            'calendarData' => $calendarData,
            'billingItems' => $billingItems,
            // 'queueData' => $queueData,
            // 'reminders' => $reminders,
            // 'todayActivities' => $todayActivities,
        ]);
    }

    public function getSummary()
    {

        $total_patients = Patient::count();
        $total_appointments = Appointment::count();
        $total_doctors = Doctor::count();
        return [
            'total_patients' => $total_patients,
            'total_appointments' => $total_appointments,
            'total_doctors' => $total_doctors,
        ];
    }

    public function getNextPatientInLine()
    {
        $nextPatient = DB::table('patient_records')
            ->join('appointments', 'appointments.patient_id', '=', 'patient_records.patient_id')
            ->join('service_charges', 'service_charges.id', '=', 'appointments.service')
            ->leftJoin('patient_vitals', 'patient_vitals.patient_id', '=', 'patient_records.patient_id')
            ->whereDate('appointments.appointment_date', '>=', now()->toDateString()) // today and onwards
            ->where('appointments.status', 'waiting')
            ->orderBy('appointments.appointment_date', 'asc') // earliest upcoming
            ->orderBy('appointments.queue_number', 'asc') // then by queue
            ->select(
                'patient_records.*',
                'patient_vitals.*',
                'appointments.id as appointment_id',
                'appointments.status',
                'appointments.appointment_date',
                'appointments.queue_number',
                'appointments.queue_type',
                'service_charges.name as service_name'
            )
            ->first();

        if ($nextPatient) {
            $medicalHistory = DB::table('patient_medical_history')
                ->where('patient_id', $nextPatient->patient_id)
                ->get();

            $nextPatient->medical_history = $medicalHistory;
        }

        return $nextPatient;
    }

    public function getUpcomingPatients()
    {
        $waitingPatients = DB::table('patient_records')
            ->join('appointments', 'appointments.patient_id', '=', 'patient_records.patient_id')
            ->join('service_charges', 'service_charges.id', '=', 'appointments.service')
            ->where('appointments.status', 'waiting')
            ->select(
                'patient_records.*',
                'appointments.id as appointment_id', // 👈 important fix
                'appointments.status',
                'appointments.appointment_date',
                'appointments.queue_number',
                'appointments.queue_type',
                'service_charges.name as service_name'
            )
            ->get();
        return $waitingPatients;
    }

    public function getPendingProcedures()
    {
        $pendingPatients = DB::table('patient_records')
            ->join('appointments', 'appointments.patient_id', '=', 'patient_records.patient_id')
            ->join('service_charges', 'service_charges.id', '=', 'appointments.service')
            ->where('appointments.status', 'on_hold')
            ->select(
                'patient_records.*',
                'appointments.id as appointment_id', // 👈 important fix
                'appointments.status',
                'appointments.appointment_date',
                'appointments.queue_number',
                'appointments.queue_type',
                'service_charges.name as service_name'
            )
            ->get();
        return $pendingPatients;
    }

    public function getCalendarData()
    {
        // Group appointments by date and count them
        $appointmentsByDate = Appointment::selectRaw('DATE(appointment_date) as date, COUNT(*) as total')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Map to a simple array format
        $calendarData = $appointmentsByDate->map(function ($item) {
            return [
                'date' => $item->date,
                'appointments_count' => $item->total,
            ];
        });

        return $calendarData;
    }

    public function getBillingItems()
    {
        $billingRecords = Billing::where('created_at', Carbon::today())->get();

        return $billingRecords;
    }

    public function getQueueNumber()
    {
        return [
            'current_queue' => 'R2',
            'prev_queue' => 'R1',
            'next_queue' => 'S1',
        ];
    }

    public function getReminders()
    {
        return Reminder::orderBy('created_at', 'desc')->get();
    }

    public function getTodayActivities()
    {

        // $unfinished_docs = UnfinishedDoc::where('status', 0)->count();

        // $total_waiting = Appointment::where('status', 'waiting')->count();
        // $total_on_hold = Appointment::where('status', 'on_hold')->count();
        // $total_checked_out = ClosedAppointment::where('status', 'checked_out')->count();
        // $total = Appointment::count();



        $today = Carbon::today(); // Get today’s date

        $unfinished_docs = UnfinishedDoc::where('status', 0)
            ->whereDate('appointment_date', $today)
            ->count();

        $total_waiting = Appointment::where('status', 'waiting')
            ->whereDate('appointment_date', $today)
            ->count();

        $total_on_hold = Appointment::where('status', 'on_hold')
            ->whereDate('appointment_date', $today)
            ->count();

        $total_checked_out = ClosedAppointment::where('status', 'checked_out')
            ->whereDate('created_at', $today)
            ->count();

        $total = Appointment::whereDate('appointment_date', $today)->count();

        return [
            'unfinished_docs' => $unfinished_docs,
            'total_waiting' => ['count' => $total_waiting, 'total' => $total],
            'total_on_hold' => ['count' => $total_on_hold, 'total' => $total],
            'total_checked_out' => ['count' => $total_checked_out, 'total' => $total],
        ];
    }


    public function get_queue_user()
    {
        $current_patient = Appointment::where('status', 'checked_in')
            ->whereDate('appointment_date', Carbon::today())
            ->orderBy('created_at', 'asc')
            ->first();

        $next_patient = Appointment::where('status', 'waiting')
            ->whereDate('appointment_date', Carbon::today())
            ->orderBy('order_number', 'asc')
            ->first();

        $previous_patient = Appointment::where('status', 'for_billing')
            ->whereDate('appointment_date', Carbon::today())
            ->orderBy('created_at', 'desc')
            ->first();
        return response()->json([
            'current_patient' => $current_patient ? $current_patient->queue_type . $current_patient->queue_number : null,
            'next_patient' => $next_patient ? $next_patient->queue_type . $next_patient->queue_number : null,
            'previous_patient' => $previous_patient ? $previous_patient->queue_type . $previous_patient->queue_number : null,
        ]);
    }

    public function storeReminder(Request $request)
    {
        $validated = $request->validate([
            'reminder_text' => 'required|string',
            'status' => 'nullable|string',
        ]);

        $reminder = Reminder::create($validated);

        return response()->json($reminder, 201);
    }

    public function updateReminder(Request $request, $id)
    {
        $validated = $request->validate([
            'reminder_text' => 'required|string',
            'status' => 'nullable|string',
        ]);

        $reminder = Reminder::findOrFail($id);
        $reminder->update($validated);

        return response()->json($reminder);
    }

    public function deleteReminder($id)
    {
        $reminder = Reminder::findOrFail($id);
        $reminder->delete();

        return response()->json(null, 204);
    }
}
