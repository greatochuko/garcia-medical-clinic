<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Patient;

class LaboratoryRequest extends Model
{
    protected $table = 'laboratory_requests';
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'appointment_id',
        'test_name',
        'others'
    ];

    // public function patient()
    // {
    //     return $this->belongsTo(Patient::class);
    // }
}