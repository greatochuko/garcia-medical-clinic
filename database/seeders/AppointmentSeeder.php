<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\ServiceCharge;

class AppointmentSeeder extends Seeder
{
    public function run()
    {
        // Make sure we have patients and services first
        if (Patient::count() === 0) {
            $this->call(PatientSeeder::class);
        }
        
        if (ServiceCharge::count() === 0) {
            $this->call(ServiceChargeSeeder::class);
        }

        // Create 10 appointments
        Appointment::factory()->count(10)->create()->each(function ($appointment) {
            // Ensure queue type matches patient type
            $patient = Patient::where('patient_id', $appointment->patient_id)->first();
            if ($patient) {
                $appointment->queue_type = $patient->patient_type === '1' ? 'S' : 'R';
                
                // Get a service that matches the patient type
                $matchingService = ServiceCharge::where('patient_type', $patient->patient_type)->inRandomOrder()->first();
                if ($matchingService) {
                    $appointment->service = $matchingService->id;
                }
                
                $appointment->save();
            }
        });
    }
} 