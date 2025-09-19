<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreatePatientRecordsTable extends Migration
{public function up()
{
    Schema::create('patient_records', function (Blueprint $table) {
        $table->id();
        $table->string('patient_id')->unique();
        $table->string('first_name')->nullable();
        $table->string('last_name')->nullable();
        $table->string('middle_initial')->nullable();
        $table->string('dob')->nullable();
        $table->string('phone')->nullable();
        $table->string('address')->nullable();
        $table->decimal('charge', 8, 2)->nullable(); // e.g., 1000.00
        $table->string('patient_type')->nullable(); // e.g., Senior
        $table->string('last_visit_date')->nullable(); // UNIX timestamp
        $table->string('age')->nullable();
        $table->enum('gender', ['Male', 'Female', 'Other'])->nullable();
        $table->timestamps(); // created_at and updated_at can also be nullable if you wish, but Laravel handles them automatically
    });

   
    Schema::create('patient_type', function (Blueprint $table) {
        $table->string('patient_type_id')->primary(); // optional: make it primary if unique
        $table->string('patient_type')->nullable();
    });

    DB::table('patient_type')->insert([
        [
            'patient_type_id' => '1',
            'patient_type' => 'senior',
        ],
        [
            'patient_type_id' => '0',
            'patient_type' => 'regular',
        ],
    ]);
}


    public function down()
    {
        Schema::dropIfExists('patient_records');
        Schema::dropIfExists('patient_type');
    }
}

