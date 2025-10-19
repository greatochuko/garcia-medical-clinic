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
        Schema::dropIfExists('medical_records');

        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();

            $table->foreignId('appointment_id')
                ->constrained('appointments')
                ->onDelete('cascade');

            $table->text('diagnosis')->nullable();
            $table->json('prescribed_medications')->nullable();

            $table->foreignId('doctor_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->string('patient_id');
            $table->foreign('patient_id')
                ->references('patient_id')
                ->on('patient_records')
                ->onDelete('cascade');

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
        Schema::dropIfExists('medical_records');
    }
};
