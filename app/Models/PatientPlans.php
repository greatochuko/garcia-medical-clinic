<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientPlans extends Model
{
    use HasFactory;
       protected $fillable = [
        'patient_id',
        'appointment_id',
        'plan'
    ];
}
