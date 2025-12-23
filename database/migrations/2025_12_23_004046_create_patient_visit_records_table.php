<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('patient_visit_records', function (Blueprint $table) {
            $table->id();

            // Core relations
            $table->foreignId('patient_id')
                ->constrained('patient_records')
                ->cascadeOnDelete();

            $table->foreignId('doctor_id')
                ->nullable()
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('appointment_id')
                ->nullable()
                ->constrained('appointments')
                ->nullOnDelete();

            $table->foreignId('medical_certificate_id')
                ->nullable()
                ->constrained('medical_certificate')
                ->nullOnDelete();

            // Status
            $table->boolean('is_closed')->default(false);

            // JSON arrays (nullable in DB)
            $table->json('chief_complaints')->nullable();
            $table->json('physical_exams')->nullable();
            $table->json('plans')->nullable();
            $table->json('diagnoses')->nullable();
            $table->json('diagnostic_results')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_visit_records');
    }
};
