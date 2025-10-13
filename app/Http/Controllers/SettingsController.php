<?php

namespace App\Http\Controllers;

use App\Models\FrequencyList;
use App\Models\Plan;
use App\Models\ServiceCharge;
use App\Models\User;
use Inertia\Inertia;


class SettingsController extends Controller
{
    public function index()
    {
        $services = ServiceCharge::orderBy('created_at', 'desc')->get()->map(function ($service) {
            return [
                'id' => $service->id,
                'name' => $service->name,
                'charge' => number_format($service->charge, 2),
                'patient_type' => $service->patient_type == 0 ? 'Regular' : 'Senior',
                'created_at' => $service->created_at,
            ];
        })->toArray();

        return Inertia::render('Settings/Services', ['services' => $services]);
    }

    public function frequency_index()
    {
        $frequencies = FrequencyList::orderBy('created_at', 'desc')->get();

        return Inertia::render('Settings/Frequency', ['frequencies' => $frequencies]);
    }

    public function plan_index()
    {
        $plans = Plan::orderBy('created_at', 'desc')->get();

        return Inertia::render('Settings/Plan', ['plans' => $plans]);
    }

    public function accounts_index()
    {
        $users = User::with('doctor')
            ->select('users.*')
            ->orderBy('created_at', 'desc')->get();

        return Inertia::render('Settings/Accounts', ['accounts' => $users]);
    }

    public function create_account()
    {
        return Inertia::render('Settings/CreateAccount');
    }

    public function update_account($id)
    {
        $user = User::with('doctor')->findOrFail($id);

        return Inertia::render('Settings/CreateAccount', [
            'accountToUpdate' => $user,
        ]);
    }
}
