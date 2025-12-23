<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('laboratory_requests', function (Blueprint $table) {
            $table->foreignId('patient_visit_record_id')
                ->nullable()
                ->constrained('patient_visit_records')
                ->nullOnDelete()
                ->after('appointment_id'); // optional: position the column
        });
    }

    public function down()
    {
        Schema::table('laboratory_requests', function (Blueprint $table) {
            $table->dropForeign(['patient_visit_record_id']);
            $table->dropColumn('patient_visit_record_id');
        });
    }
};
