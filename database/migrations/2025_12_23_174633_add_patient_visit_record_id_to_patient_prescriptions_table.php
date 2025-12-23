<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('patient_prescriptions', function (Blueprint $table) {
            $table->foreignId('patient_visit_record_id')
                ->nullable()
                ->after('appointment_id')
                ->constrained('patient_visit_records')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('patient_prescriptions', function (Blueprint $table) {
            $table->dropForeign(['patient_visit_record_id']);
            $table->dropColumn('patient_visit_record_id');
        });
    }
};
