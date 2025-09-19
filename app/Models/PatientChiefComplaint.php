<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientChiefComplaint extends Model
{
    use HasFactory;
     protected $fillable = [
        'patient_id',
        'appointment_id',
        'chief_complaint',
    ];
}
