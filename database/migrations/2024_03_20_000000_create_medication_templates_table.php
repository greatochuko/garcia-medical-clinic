<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('medication_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('set_id')->nullable();
            $table->json('medications')->nullable(); // Store medication details as JSON
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('medication_templates');
    }
}; 