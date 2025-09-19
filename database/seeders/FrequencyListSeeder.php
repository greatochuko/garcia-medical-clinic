<?php

namespace Database\Seeders;

use App\Models\FrequencyList;
use Illuminate\Database\Seeder;

class FrequencyListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Define common medication frequency instructions
        $frequencies = [
            'With food',
            'As needed',
            'At noon',
            'At night',
            'Twice a day',
            'Three times a day',
            'In the morning',
            'Monthly',
            'Weekly',
            'Daily',
            'Every 4 hours',
            'Every 6 hours',
            'Every 8 hours',
            'Every 12 hours',
            'Before meals',
            'After meals',
            'Before bedtime',
            'With breakfast',
            'With lunch',
            'With dinner',
            'On empty stomach',
            'Every other day',
            'Once a week',
            'Twice a week',
            'Every Monday',
            'Every Friday',
            'First day of month',
            'Last day of month',
            'When required for pain',
            'When required for fever'
        ];

        // Create each frequency record
        foreach ($frequencies as $frequency) {
            FrequencyList::create(['name' => $frequency]);
        }
    }
}