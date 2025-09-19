<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientLaboratoryTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'appointment_id',
        'test_name',
        'result_value',
        'test_date'
    ];

    protected $casts = [
        'test_date' => 'date'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
} 