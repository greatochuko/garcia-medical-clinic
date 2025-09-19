<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('laboratory_requests', function (Blueprint $table) {
            $table->id();
            $table->string('patient_id');
            $table->string('appointment_id');
            $table->string('doctor_id');
            $table->string('test_name')->nullable();
            $table->text('others')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('laboratory_requests');
    }
};