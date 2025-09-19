<?php

namespace Database\Seeders;

use App\Models\MedicationTemplate;
use Illuminate\Database\Seeder;

class MedicationTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Create additional random templates to reach 30 total
        MedicationTemplate::factory()->count(30)->create();
    }
}