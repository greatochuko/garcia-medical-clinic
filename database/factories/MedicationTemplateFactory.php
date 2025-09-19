<?php

namespace Database\Factories;

use App\Models\MedicationTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedicationTemplateFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = MedicationTemplate::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $templates = [
            'Pedia Infection (0-12 months)',
            'Pedia Infection (1-2 years)',
            'Pedia Infection (3-5 years)',
            'Pedia Infection (5-7 years)',
            'Pedia Infection (8-10 years)',
            'Pedia Infection (11-13 years)',
            'Pedia Infection (14-16 years)',
            'Pedia Infection (17-18 years)',
            'Adult Infection (19-30 years)',
            'Adult Infection (31-45 years)',
            'Adult Infection (46-60 years)',
            'Adult Infection (61+ years)',
            'Hypertension Management',
            'Diabetes Management',
            'Asthma Treatment',
            'Allergy Relief',
            'Pain Management',
            'Fever Protocol',
            'Gastrointestinal Issues',
            'Respiratory Infection',
            'Urinary Tract Infection',
            'Skin Conditions',
            'Prenatal Care',
            'Postnatal Care',
            'Geriatric Care',
            'Pediatric Fever',
            'Chronic Pain Management',
            'Post-Surgery Recovery',
            'Immunocompromised Protocol',
            'Cardiovascular Management'
        ];

        return [
            'name' => $this->faker->randomElement($templates),
        ];
    }
}