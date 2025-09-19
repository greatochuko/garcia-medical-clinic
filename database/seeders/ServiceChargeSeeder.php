<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ServiceCharge;

class ServiceChargeSeeder extends Seeder
{
    public function run()
    {
        $services = [
            [
                'name' => 'Consultation',
                'charge' => 500.00,
                'patient_type' => 0, // Regular
                'description' => 'General consultation service'
            ],
            [
                'name' => 'Medical Certificate',
                'charge' => 300.00,
                'patient_type' => 1, // Senior
                'description' => 'Medical certificate issuance'
            ],
            [
                'name' => 'Laboratory Test',
                'charge' => 1000.00,
                'patient_type' => 0, // Regular
                'description' => 'General laboratory testing services'
            ],
            [
                'name' => 'X-ray',
                'charge' => 1000.00,
                'patient_type' => 1, // Senior
                'description' => 'X-ray imaging service'
            ],
            [
                'name' => 'Laboratory Test + Medical Certificate',
                'charge' => 1300.00,
                'patient_type' => 0, // Regular
                'description' => 'Test data'
            ],
            [
                'name' => 'Senior checkup',
                'charge' => 1000.00,
                'patient_type' => 1, // Senior
                'description' => 'Comprehensive senior citizen checkup'
            ],
        ];

        foreach ($services as $service) {
            ServiceCharge::create($service);
        }
    }
} 