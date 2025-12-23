<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('medical_certificate', function (Blueprint $table) {
            $table->foreignId('patient_visit_record_id')
                ->nullable()
                ->after('id') // optional, position after 'id'
                ->constrained('patient_visit_records')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('medical_certificate', function (Blueprint $table) {
            $table->dropForeign(['patient_visit_record_id']);
            $table->dropColumn('patient_visit_record_id');
        });
    }
};
