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
        "medication_id",
        "dosage",
        "amount",
        "frequency_id",  // changed from 'frequency' to 'frequency_id'
        "duration",
    ];

    protected $casts = [
        'amount' => 'integer',
        'duration' => 'integer',
    ];

    public function medication()
    {
        return $this->belongsTo(MedicationList::class, 'medication_id');
    }

    public function frequency()
    {
        return $this->belongsTo(FrequencyList::class, 'frequency_id');
    }
}
