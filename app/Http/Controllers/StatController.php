<?php

namespace App\Http\Controllers;

use App\Models\MedicationList;
use App\Models\ServiceCharge;
use App\Models\User;
use Inertia\Inertia;

class StatController extends Controller
{
    function index()
    {
        $serviceTypes = ServiceCharge::select('id', 'name', 'charge', 'patient_type')
            ->get();

        $users = User::select('id', 'first_name', 'last_name', 'middle_initial', 'role', 'avatar_url')
            ->orderBy('created_at', 'desc')
            ->get();

        $medicationList = MedicationList::select('id', 'name')
            ->get();

        return Inertia::render('Stats', ['services' => $serviceTypes, 'users' => $users, 'medicationList' => $medicationList]);
    }
}
