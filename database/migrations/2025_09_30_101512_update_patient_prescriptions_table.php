<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the table if it already exists
        Schema::dropIfExists('patient_prescriptions');

        // Create the new table
        Schema::create('patient_prescriptions', function (Blueprint $table) {
            $table->id();
            $table->string('patient_id');
            $table->string('doctor_id');
            $table->string('appointment_id');
            $table->unsignedBigInteger('medication_id'); // link to medication_lists
            $table->string('dosage')->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('frequency')->nullable();
            $table->string('duration')->nullable();
            $table->timestamps();

            $table->foreign('medication_id')->references('id')->on('medication_lists')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_prescriptions');
    }
};
