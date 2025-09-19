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
        'service',
        'status',
        'queue_type',
        'queue_number'
    ];

    protected $casts = [
        // 'appointment_date' => 'date',
        // 'order_number' => 'integer',
        // 'service' => 'integer',
        // 'queue_number' => 'integer'
    ];

    /**
     * Get the patient that owns the appointment.
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }

    /**
     * Get the service associated with the appointment.
     */
    public function serviceCharge(): BelongsTo
    {
        return $this->belongsTo(ServiceCharge::class, 'service', 'id');
    }

} 