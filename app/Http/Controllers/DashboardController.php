<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\ClosedAppointment;
use App\Models\UnfinishedDoc;
use App\Models\Reminder;

class DashboardController extends Controller
{
    public function show()
    {
        // $summary = $this->getSummary();
        // $upcomingPatients = $this->getUpcomingPatients();
        // $pendingProcedures = $this->getPendingProcedures();
        // $calendarData = $this->getMonthlyCalendar();
        // $billingItems = $this->getBillingItems();
        // $queueData = $this->getQueueNumber();
        // $reminders = $this->getReminders();
        // $todayActivities = $this->getTodayActivities();

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => Auth::user(),
            ],
            // 'summary' => $summary,
            // 'upcomingPatients' => $upcomingPatients,
            // 'pendingProcedures' => $pendingProcedures,
            // 'calendarData' => $calendarData,
            // 'billingItems' => $billingItems,
            // 'queueData' => $queueData,
            // 'reminders' => $reminders,
            // 'todayActivities' => $todayActivities,
        ]);
    }

    public function getSummary()
    {

        $total_patients = Patient::count();
        $total_appointments = Appointment::count();
        return [
            'total_patients' => $total_patients, // Placeholder
            'total_appointments' => $total_appointments, // Placeholder
        ];
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

    public function getMonthlyCalendar()
    {
        $now = Carbon::now();
        return [
            'month' => $now->format('F'),
            'year' => $now->format('Y'),
            // Add more calendar data here later, e.g., days with appointments
        ];
    }

    public function getBillingItems()
    {
        $billingPatients = DB::table('patient_records')
            ->join('appointments', 'appointments.patient_id', '=', 'patient_records.patient_id')
            ->join('billings', 'billings.patient_id', '=', 'appointments.patient_id')
            ->join('service_charges', 'appointments.service', '=', 'service_charges.id') // <-- Added join
            ->where('appointments.appointment_date', Carbon::today())
            ->where('appointments.status', 'for_billing')
            ->select(
                'patient_records.*',
                'appointments.*',
                'billings.*',
                'service_charges.name as service_name',
                'service_charges.charge as amount'
            )
            ->get();

        return $billingPatients;
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
