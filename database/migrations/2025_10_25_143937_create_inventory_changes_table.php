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
        Schema::create('inventory_changes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medication_id');
            $table->foreignId('user_id');
            $table->date('lastRunDate');
            $table->enum('entryDetails', ['Restock', 'Pull Out', 'Inventory Run Check']);
            $table->integer('quantity');
            $table->date('expiryDate')->nullable();
            $table->integer('newTotal')->nullable();
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
        Schema::dropIfExists('inventory_changes');
    }
};
