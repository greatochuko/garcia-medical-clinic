<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('billings', function (Blueprint $table) {
            $table->id();
            $table->string('patient_id');
            $table->string('appointment_id')->nullable();
            $table->text('services'); // JSON or comma-separated string
            $table->decimal('total', 10, 2);
            $table->decimal('discount', 10, 2)->nullable();
            $table->decimal('final_total', 10, 2);
            $table->boolean('paid')->default(false);
            $table->timestamps();

            // $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('billings');
    }
}; 