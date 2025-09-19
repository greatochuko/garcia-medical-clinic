<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClosedAppointment extends Model
{
    use HasFactory;

    protected $table = 'closed_appointments';
    protected $fillable = [
        'patient_id',
        'appointment_id',
        'queue_number',
        'name',
        'age',
        'gender',
        'service',
        'status',
    ];

    protected $casts = [
      
    ];
} 