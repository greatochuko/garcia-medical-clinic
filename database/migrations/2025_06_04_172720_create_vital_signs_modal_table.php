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
       Schema::create('patient_vitals', function (Blueprint $table) {
    $table->id();
    $table->integer('patient_id'); // required

    // All the rest are nullable
    $table->integer('blood_diastolic_pressure')->nullable();
    $table->integer('blood_systolic_pressure')->nullable();
    $table->integer('heart_rate')->nullable();
    $table->integer('o2saturation')->nullable();
    $table->integer('height_ft')->nullable();
    $table->integer('height_in')->nullable();
    $table->decimal('temperature', 8, 2)->nullable(); 
    $table->decimal('weight', 8, 2)->nullable();      

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
        Schema::dropIfExists('patient_vitals');
    }
};
