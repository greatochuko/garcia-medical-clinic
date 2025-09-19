<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ClosedAppointment;

class PatientAppointmentSeeder extends Seeder
{
    public function run()
    {
        ClosedAppointment::factory()->count(10)->create();
    }
} 