<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LaboratoryTest;

class LaboratoryTestSeeder extends Seeder
{
    public function run()
    {
        LaboratoryTest::factory()->count(20)->create();
    }
}