<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('patient_prescriptions', function (Blueprint $table) {
            $table->unsignedBigInteger('appointment_id')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('patient_prescriptions', function (Blueprint $table) {
            $table->unsignedBigInteger('appointment_id')->nullable(false)->change();
        });
    }

};
