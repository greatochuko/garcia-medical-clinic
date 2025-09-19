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
            'name' => $this->faker->randomElement($medications) . ' ' . $this->faker->word,
            'dose' => $this->faker->randomElement($doses),
            'frequency' => $this->faker->randomElement($frequencies),
            'duration' => $this->faker->randomElement($durations),
            'amount' => $this->faker->randomElement($amounts),
            'template_id' => MedicationTemplate::factory()
        ];
    }
} 