<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('list_medication_templete', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medication_template_id')->constrained('medication_templates')->onDelete('cascade');
            $table->string('medication_name');
            $table->string('dosage');
            $table->string('frequency');
            $table->string('duration');
            $table->string('amount');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('list_medication_templete');
    }
}; 