<?php

namespace App\Http\Controllers;

use App\Models\ServiceCharge;
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
}
