<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
             $table->string('patient_id');
             $table->integer('doctor_id');
             $table->integer('closed_appointment_id');
            $table->dateTime('date');
            $table->boolean('has_document')->default(false);
             $table->string('notes')->nullable();
            $table->string('status')->default('open');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('medical_records');
    }
}; 