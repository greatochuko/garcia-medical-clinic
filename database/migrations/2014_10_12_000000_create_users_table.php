<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('middle_initial')->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('login_id')->nullable()->unique();
            $table->string('password');
            // $table->enum('role', ['admin', 'doctor', 'secretary'])->default('admin');
            $table->string('role')->nullable()->default(null);
            $table->rememberToken();
            $table->timestamps();
        });

        // Insert default admin user
        DB::table('users')->insert([
            'first_name' => 'Admin',
            'last_name' => null,
            'middle_initial' => null,
            'email' => 'admin@example.com',
            'login_id' => 'admin', // optional, you can skip or adjust
            'password' => Hash::make('helloAdmin'),
            'role' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
