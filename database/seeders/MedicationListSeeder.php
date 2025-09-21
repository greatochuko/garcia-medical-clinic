<?php

namespace Database\Seeders;

use App\Models\MedicationList;
use Illuminate\Database\Seeder;

class MedicationListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $medications = [
            ['name' => 'Paracetamol'],
            ['name' => 'Amoxicillin'],
            ['name' => 'Ibuprofen'],
            ['name' => 'Omeprazole'],
            ['name' => 'Metformin'],
            ['name' => 'Aspirin'],
            ['name' => 'Celecoxib'],
            ['name' => 'Doxycycline'],
            ['name' => 'Ciprofloxacin'],
            ['name' => 'Azithromycin'],
            ['name' => 'Cefuroxime'],
            ['name' => 'Cefixime'],
            ['name' => 'Cefdinir'],
            ['name' => 'Cefpodoxime'],
            ['name' => 'Cefprozil'],
            ['name' => 'Cefuroxime'],
            ['name' => 'Cefdinir'],
            ['name' => 'Cefpodoxime'],
            ['name' => 'Cefprozil'],
            ['name' => 'Cefuroxime'],
            ['name' => 'Cefdinir'],
            ['name' => 'Cefpodoxime'],
            ['name' => 'Cefprozil'],
            ['name' => 'Cefuroxime'],
            ['name' => 'Cefdinir'],
            ['name' => 'Cefpodoxime'],
            ['name' => 'Cefprozil'],
            ['name' => 'Cefuroxime'],
            ['name' => 'Cefdinir'],
            ['name' => 'Cefpodoxime'],
        ];

        foreach ($medications as $medication) {
            MedicationList::create($medication);
        }
    }
}
