<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppointmentsTable extends Migration
{
    public function up()
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_number');
            $table->string('patient_id');
            $table->date('appointment_date');
            $table->unsignedBigInteger('service');
            $table->string('status');
            $table->string('queue_type');
            $table->integer('queue_number');
            $table->timestamps();

            // Foreign key constraints
            // $table->foreign('patient_id')
            //       ->references('patient_id')
            //       ->on('patient_records')
            //       ->onDelete('cascade');
            
            // $table->foreign('service')
            //       ->references('id')
            //       ->on('service_charges')
            //       ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('appointments');
    }
} 