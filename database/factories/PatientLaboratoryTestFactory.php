<?php

namespace Database\Factories;

use App\Models\PatientLaboratoryTest;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class PatientLaboratoryTestFactory extends Factory
{
    protected $model = PatientLaboratoryTest::class;

    public function definition()
    {
        $testNames = ['Potassium', 'Sodium', 'Chloride', 'BUN', 'Creatinine', 'Glucose', 'Calcium', 'SUA'];
        
        return [
            'test_name' => $this->faker->randomElement($testNames),
            'result_value' => $this->faker->randomFloat(2, 50, 500),
            'test_date' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }
} 