<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'patient_id',
        'appointment_date',
        'service',        // now a string (e.g. "check-up")
        'status',
        'queue_type',
        'queue_number'
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'order_number'     => 'integer',
        'queue_number'     => 'integer',
    ];

    /**
     * Get the patient that owns the appointment.
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }

    public function serviceCharge()
    {
        return $this->hasOne(ServiceCharge::class, 'name', 'service');
    }
}
