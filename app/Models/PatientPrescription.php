<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientPrescription extends Model
{
    use HasFactory;
    protected $fillable = [
    "patient_id",
    "doctor_id",
    "appointment_id",
    "medication",
    "dosage",
    "amount",
    "frequency",
    "duration",
];

}
