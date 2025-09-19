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
        Schema::create('medication_sub_templates', function (Blueprint $table) {
            $table->id();
            $table->integer('medication_template_id');
            $table->string('medication_name');
            $table->string('dosage');
            $table->string('frequency');
            $table->string('amount');
            $table->string('duration');
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
        Schema::dropIfExists('medication_sub_templates');
    }
};
