<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'closed_appointment_id',
        'doctor_id',
        'date',
        'has_document',
        'status'
    ];

    protected $casts = [
        'date' => 'datetime',
        'has_document' => 'boolean'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
} 