<?php

namespace App\Http\Controllers;

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

        return Inertia::render('Stats/Stats', ['services' => $serviceTypes, 'users' => $users]);
    }
}
