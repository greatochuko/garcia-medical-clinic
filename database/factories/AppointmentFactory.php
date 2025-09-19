<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\ServiceCharge;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition()
    {
        static $orderNumber = 1;
        
        return [
            'order_number' => $orderNumber++,
            'patient_id' => Patient::inRandomOrder()->first()->patient_id,
            'appointment_date' => Carbon::now()->addDays(rand(0, 30))->format('Y-m-d'),
            'service' => ServiceCharge::inRandomOrder()->first()->id,
            'status' => $this->faker->randomElement(['waiting', 'for_billing', 'checked_in', 'checked_out', 'on_hold']),
            'queue_type' => $this->faker->randomElement(['R', 'S']), // R for Regular, S for Senior
            'queue_number' => $this->faker->unique()->numberBetween(1, 100),
        ];
    }
} 