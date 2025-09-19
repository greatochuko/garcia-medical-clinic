<?php

namespace Database\Factories;

use App\Models\LaboratoryTest;
use Illuminate\Database\Eloquent\Factories\Factory;

class LaboratoryTestFactory extends Factory
{
    protected $model = LaboratoryTest::class;

    public function definition()
    {
        return [
            'name' => $this->faker->unique()->randomElement([
                'Complete Blood Count (CBC)',
                'Blood Glucose',
                'Lipid Panel',
                'Liver Function Test',
                'Kidney Function Test',
                'Thyroid Function Test',
                'Hemoglobin A1C',
                'Urinalysis',
                'Electrolyte Panel',
                'Vitamin D',
                'Vitamin B12',
                'Iron Panel',
                'Calcium',
                'Magnesium',
                'Potassium',
                'Sodium',
                'Chloride',
                'Bicarbonate',
                'Phosphorus',
                'Uric Acid',
                'C-Reactive Protein',
                'Erythrocyte Sedimentation Rate',
                'Prothrombin Time',
                'Partial Thromboplastin Time',
                'Blood Type',
                'Rheumatoid Factor',
                'Antinuclear Antibody',
                'Hepatitis Panel',
                'HIV Test',
                'Tuberculosis Test'
            ]),
            'status' => $this->faker->boolean(90), // 90% chance of being active
        ];
    }
}