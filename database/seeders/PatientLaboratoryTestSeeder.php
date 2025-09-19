<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatientLaboratoryTest;
use App\Models\Patient;

class PatientLaboratoryTestSeeder extends Seeder
{
    public function run()
    {
        $patients = Patient::all();
        
        foreach ($patients as $patient) {
            PatientLaboratoryTest::factory()
                ->count(5) // Create 5 test records per patient
                ->create([
                    'patient_id' => $patient->id
                ]);
        }
    }
} 