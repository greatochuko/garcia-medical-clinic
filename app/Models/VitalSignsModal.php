<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VitalSignsModal extends Model
{
    use HasFactory;
    protected $table = 'patient_vitals';
    protected $fillable = [
        'patient_id',
        'blood_diastolic_pressure',
        'blood_systolic_pressure',
        'heart_rate',
        'o2saturation',
        'temperature',
        'height_ft',
        'height_in',
        'weight',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }
}
