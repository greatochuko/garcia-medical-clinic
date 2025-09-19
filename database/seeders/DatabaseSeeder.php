<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Doctor;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // Create 1 admin user
        User::factory()->admin()->create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'login_id' => 'admin',
            'password' => bcrypt('password'),
        ]);

        // Create 15 doctors with their user accounts
        Doctor::factory()->count(15)->create();

        // Create 15 secretaries
        User::factory()->secretary()->count(15)->create();

        $this->call([
            PatientSeeder::class,
            ServiceChargeSeeder::class,
            AppointmentSeeder::class,
            PlanSeeder::class,
            FrequencyListSeeder::class,
            MedicationListSeeder::class,
            MedicationTemplateSeeder::class,
            ListMedicationTempleteSeeder::class,
        ]);
    }
}
