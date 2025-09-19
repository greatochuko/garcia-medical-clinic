<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ClosedAppointmentFactory extends Factory
{
    public function definition()
    {
        $services = [
            'Regular Check Up',
            'Senior Check Up',
            'Senior Check Up + Medical Certificate',
            'Medical Certificate',
            'Consultation'
        ];

        $statuses = ['checked out'];
        $genders = ['Male', 'Female'];

        return [
            'queue_number' => $this->faker->randomElement(['R', 'S']) . $this->faker->numberBetween(1, 50),
            'name' => $this->faker->lastName . ', ' . $this->faker->firstName . ' ' . $this->faker->firstName,
            'age' => $this->faker->numberBetween(18, 90),
            'gender' => $this->faker->randomElement($genders),
            'service' => $this->faker->randomElement($services),
            'status' => $this->faker->randomElement($statuses),
          
        ];
    }
} 