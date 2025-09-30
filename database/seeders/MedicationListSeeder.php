<?php

namespace Database\Seeders;

use App\Models\MedicationList;
use Illuminate\Database\Seeder;

class MedicationListSeeder extends Seeder
{
    public function run(): void
    {
        $medications = [
            // Pain Relief
            ['name' => 'Paracetamol', 'category' => 'Pain Relief', 'price' => 2.50, 'quantity' => 200, 'controlled' => false],
            ['name' => 'Ibuprofen', 'category' => 'Pain Relief', 'price' => 3.20, 'quantity' => 150, 'controlled' => false],
            ['name' => 'Aspirin', 'category' => 'Pain Relief', 'price' => 1.80, 'quantity' => 300, 'controlled' => false],
            ['name' => 'Celecoxib', 'category' => 'Pain Relief', 'price' => 7.40, 'quantity' => 80, 'controlled' => true],

            // Antibiotics
            ['name' => 'Amoxicillin', 'category' => 'Antibiotic', 'price' => 5.00, 'quantity' => 100, 'controlled' => false],
            ['name' => 'Azithromycin', 'category' => 'Antibiotic', 'price' => 6.50, 'quantity' => 90, 'controlled' => false],
            ['name' => 'Ciprofloxacin', 'category' => 'Antibiotic', 'price' => 8.20, 'quantity' => 70, 'controlled' => false],
            ['name' => 'Doxycycline', 'category' => 'Antibiotic', 'price' => 4.60, 'quantity' => 110, 'controlled' => false],
            ['name' => 'Cefuroxime', 'category' => 'Antibiotic', 'price' => 9.30, 'quantity' => 50, 'controlled' => false],
            ['name' => 'Cefixime', 'category' => 'Antibiotic', 'price' => 10.00, 'quantity' => 40, 'controlled' => false],

            // Diabetes
            ['name' => 'Metformin', 'category' => 'Diabetes', 'price' => 6.10, 'quantity' => 120, 'controlled' => false],
            ['name' => 'Glimepiride', 'category' => 'Diabetes', 'price' => 7.00, 'quantity' => 60, 'controlled' => false],
            ['name' => 'Insulin Glargine', 'category' => 'Diabetes', 'price' => 25.00, 'quantity' => 30, 'controlled' => true],

            // Gastrointestinal
            ['name' => 'Omeprazole', 'category' => 'Gastrointestinal', 'price' => 4.75, 'quantity' => 100, 'controlled' => false],
            ['name' => 'Pantoprazole', 'category' => 'Gastrointestinal', 'price' => 5.20, 'quantity' => 90, 'controlled' => false],
            ['name' => 'Ranitidine', 'category' => 'Gastrointestinal', 'price' => 3.50, 'quantity' => 70, 'controlled' => false],

            // Cardiovascular
            ['name' => 'Atorvastatin', 'category' => 'Cardiovascular', 'price' => 12.00, 'quantity' => 80, 'controlled' => false],
            ['name' => 'Amlodipine', 'category' => 'Cardiovascular', 'price' => 8.50, 'quantity' => 100, 'controlled' => false],
            ['name' => 'Lisinopril', 'category' => 'Cardiovascular', 'price' => 9.00, 'quantity' => 75, 'controlled' => false],
            ['name' => 'Losartan', 'category' => 'Cardiovascular', 'price' => 11.20, 'quantity' => 60, 'controlled' => false],

            // Central Nervous System
            ['name' => 'Diazepam', 'category' => 'CNS', 'price' => 6.00, 'quantity' => 40, 'controlled' => true],
            ['name' => 'Alprazolam', 'category' => 'CNS', 'price' => 8.50, 'quantity' => 30, 'controlled' => true],
            ['name' => 'Sertraline', 'category' => 'CNS', 'price' => 14.00, 'quantity' => 50, 'controlled' => false],
        ];

        foreach ($medications as $medication) {
            MedicationList::create($medication);
        }
    }
}
