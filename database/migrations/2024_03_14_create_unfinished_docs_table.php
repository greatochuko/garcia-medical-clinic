<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('unfinished_docs', function (Blueprint $table) {
            $table->id();
            $table->string('patient_id');
            $table->string('appointment_id');
            $table->date('appointment_date');
            $table->integer('doctor_id')->nullable();
            $table->integer('status')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('unfinished_docs');
    }
}; 