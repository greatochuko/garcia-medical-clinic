<?php

namespace Database\Seeders;

use App\Models\ListMedicationTemplete;
use App\Models\MedicationTemplate;
use Illuminate\Database\Seeder;

class ListMedicationTempleteSeeder extends Seeder
{
    public function run()
    {
        // Get all existing medication templates
        $templates = MedicationTemplate::all();

        // For each template, create 3-5 medications
        foreach ($templates as $template) {
            ListMedicationTemplete::factory(rand(3, 5))->create([
                'template_id' => $template->id
            ]);
        }
    }
} 