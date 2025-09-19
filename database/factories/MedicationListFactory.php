<?php

namespace Database\Factories;

use App\Models\MedicationList;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedicationListFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = MedicationList::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        $medications = [
            'Paracetamol',
            'Amoxicillin',
            'Ibuprofen',
            'Omeprazole',
            'Metformin',
            'Aspirin',
            'Celecoxib',
            'Doxycycline',
            'Ciprofloxacin',
            'Azithromycin',
            'Cefuroxime',
            'Cefixime',
            'Cefdinir',
            'Cefpodoxime',
            'Cefprozil',
            'Atorvastatin',
            'Losartan',
            'Amlodipine',
            'Lisinopril',
            'Metoprolol',
            'Simvastatin',
            'Hydrochlorothiazide',
            'Gabapentin',
            'Sertraline',
            'Fluoxetine',
            'Escitalopram',
            'Montelukast',
            'Albuterol',
            'Levothyroxine',
            'Prednisone',
        ];

        return [
            'name' => $this->faker->randomElement($medications),
        ];
    }
}