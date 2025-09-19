<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class PatientFactory extends Factory
{
    protected $model = Patient::class;

    public function definition()
    {
        $gender = $this->faker->randomElement(['Male', 'Female']);
        $age = $this->faker->numberBetween(18, 80);
        $dob = Carbon::now()->subYears($age)->format('Y-m-d');
        $patientType = $age >= 60 ? '1' : '0';
        $lastVisitDate = $this->faker->dateTimeBetween('-1 year', 'now')->getTimestamp();
        
        return [
            'patient_id' => $this->faker->unique()->numberBetween(1000, 9999),
            'first_name' => $this->faker->firstName($gender),
            'last_name' => $this->faker->lastName(),
            'middle_initial' => strtoupper($this->faker->randomLetter()),
            'dob' => $dob,
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'charge' => $this->faker->randomElement([300.00, 500.00, 1000.00]),
            'patient_type' => $patientType,
            'last_visit_date' => $lastVisitDate,
            'age' => $age,
            'gender' => $gender,
        ];
    }
} 