<?php

namespace Database\Factories;

use App\Models\ListMedicationTemplete;
use App\Models\MedicationTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

class ListMedicationTempleteFactory extends Factory
{
    protected $model = ListMedicationTemplete::class;

    public function definition()
    {
        $medications = [
            'Paracetamol',
            'Nystatin',
            'Salbutamol',
            'Ibuprofen',
            'Amoxicillin'
        ];

        $doses = ['1 tab', '2 tab', '5 mL', '10 mL', '1 neb'];
        $frequencies = [
            'once a day',
            'twice a day',
            'every 4 hours',
            'every 6 hours',
            'every 8 hours as needed'
        ];
        $durations = ['7 days', '14 days', '30 days', '-', '5 days'];
        $amounts = ['1 bottle', '10 tablets', '5 nebules', '20 tablets', '1 box'];

        return [
            'medication_name' => $this->faker->word(),
            'dosage' => $this->faker->randomElement(['5 mg', '10 mg', '1 neb', '10 mL']), // FIXED (was "dose")
            'frequency' => $this->faker->randomElement(['once daily', 'every 6 hours', 'every 12 hours']),
            'duration' => $this->faker->randomElement(['3 days', '5 days', '7 days']),
            'amount' => $this->faker->randomElement(['10 tablets', '20 tablets', '5 nebules']),
            'medication_template_id' => null, // will be set in seeder
        ];
    }
}
