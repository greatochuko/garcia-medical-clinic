<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('patient_prescriptions', function (Blueprint $table) {
    $table->id();
    $table->string('patient_id'); // Required
    $table->string('doctor_id'); // Required
    $table->string('appointment_id'); // Required
    $table->string('medication'); // Required
    $table->string('dosage')->nullable();
    $table->string('amount')->nullable();
    $table->string('frequency')->nullable();
    $table->string('duration')->nullable();
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('patient_prescriptions');
    }
};
