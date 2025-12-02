<?php

namespace App\Http\Controllers;

use App\Models\Billing;
use App\Models\Expense;
use App\Models\MedicationList;
use App\Models\ServiceCharge;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class StatController extends Controller
{
    function index()
    {
        if (!in_array(auth()->user()->role, ['admin', 'doctor'])) {
            return redirect('/')->with('error', 'Unauthorized access.');
        }

        $serviceTypes = ServiceCharge::select('id', 'name', 'charge', 'patient_type')
            ->get();

        $users = User::select('id', 'first_name', 'last_name', 'middle_initial', 'role', 'avatar_url')
            ->orderBy('created_at', 'desc')
            ->get();

        $medicationList = MedicationList::select('id', 'name')
            ->get();

        $billingRecords = Billing::get();

        $months = [];
        for ($i = 0; $i < 12; $i++) {
            $date = Carbon::now()->subMonths($i);
            $months[] = [
                'year' => $date->year,
                'month' => $date->month,
            ];
        }

        // Fetch expenses for these months
        $expenses = Expense::where(function ($query) use ($months) {
            foreach ($months as $m) {
                $query->orWhere(function ($q) use ($m) {
                    $q->where('year', $m['year'])
                        ->where('month', $m['month']);
                });
            }
        })->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();

        return Inertia::render('Stats', ['services' => $serviceTypes, 'users' => $users, 'medicationList' => $medicationList, 'billingRecords' => $billingRecords, 'expenses' => $expenses]);
    }
}
