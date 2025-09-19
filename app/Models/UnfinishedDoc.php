<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UnfinishedDoc extends Model
{
    protected $fillable = [
        'patient_id',
        'appointment_date',
        'appointment_id',
        'doctor_id',
        'status'
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'status' => 'integer'
    ];
    
    /**
     * Get the patient associated with the unfinished document.
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }
    
    /**
     * Get the doctor associated with the unfinished document.
     */
    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}