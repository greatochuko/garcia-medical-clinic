<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('patient_laboratory_tests', function (Blueprint $table) {
            $table->id();
            $table->string('patient_id');
            $table->integer('appointment_id');
            $table->string('test_name');
            $table->decimal('result_value', 10, 2);
            $table->date('test_date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('patient_laboratory_tests');
    }
}; 