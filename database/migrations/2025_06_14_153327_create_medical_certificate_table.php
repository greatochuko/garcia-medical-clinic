<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('medical_certificate', function (Blueprint $table) {
            $table->id();
            $table->string('patient_id');
            $table->string('doctor_id');
            $table->string('appointment_id')->nullable();
            $table->string('civilStatus');
            $table->string('diagnosis');
            $table->string('comments');
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
        Schema::dropIfExists('medical_certificate');
    }
};
