<?php

namespace Database\Factories;

use App\Models\ServiceCharge;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceChargeFactory extends Factory
{
    protected $model = ServiceCharge::class;

    public function definition()
    {
        return [
            'name' => $this->faker->unique()->word(),
            'charge' => $this->faker->randomElement([300.00, 500.00, 1000.00]),
            'patient_type' => $this->faker->randomElement([0, 1]), // 0 for Regular, 1 for Senior
            'description' => $this->faker->sentence(),
        ];
    }
} 