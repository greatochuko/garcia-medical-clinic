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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->integer('year'); // e.g., 2025
            $table->integer('month'); // 1 - 12

            $table->decimal('electricity', 10, 2)->default(0);
            $table->decimal('water', 10, 2)->default(0);
            $table->decimal('internet', 10, 2)->default(0);
            $table->decimal('salary', 10, 2)->default(0);
            $table->decimal('rent', 10, 2)->default(0);

            $table->decimal('total', 12, 2)->default(0); // optional but useful
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
        Schema::dropIfExists('expenses');
    }
};
