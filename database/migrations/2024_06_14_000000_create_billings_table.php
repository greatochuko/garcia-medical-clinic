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
            $table->json('patient');
            $table->json('service');
            $table->json('prescriptions')->nullable();
            $table->decimal('total', 10, 2);
            $table->decimal('discount', 10, 2)->nullable();
            $table->decimal('final_total', 10, 2);
            $table->boolean('paid')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('billings');
    }
};
