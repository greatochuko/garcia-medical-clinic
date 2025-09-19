<?php

namespace Database\Factories;

use App\Models\FrequencyList;
use Illuminate\Database\Eloquent\Factories\Factory;

class FrequencyListFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = FrequencyList::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        // We'll override this in the seeder with specific values
        return [
            'name' => $this->faker->sentence(2),
        ];
    }
}