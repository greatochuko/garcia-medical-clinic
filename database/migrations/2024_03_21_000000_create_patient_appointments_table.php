<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('closed_appointments', function (Blueprint $table) {
            $table->id();
            $table->string('patient_id');
            $table->string('appointment_id');
            $table->string('queue_number');
            $table->string('name');
            $table->string('age')->nullable();
            $table->string('gender');
            $table->string('service');
            $table->string('status');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('closed_appointments');
    }
}; 