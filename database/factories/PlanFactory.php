<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Plan>
 */
class PlanFactory extends Factory
{
    public function definition(): array
    {
        $plans = [
            'avoid fatty foods',
            'advised check up with surgeon',
            'increase fluid intake',
            'low salt, low fat diet',
            'hot-cold compress',
            'daily bathe with oilatum bar soap',
            'Mometasone furoate cream- apply OD',
            'ISSUED MED CERT. Rest for 2 days'
        ];

        return [
            'name' => $this->faker->randomElement($plans),
        ];
    }
}
