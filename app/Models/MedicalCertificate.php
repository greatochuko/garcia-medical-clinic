<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalCertificate extends Model
{
    use HasFactory;
    protected $table = 'medical_certificate';

    protected $fillable = [
        'civilStatus',
        'diagnosis',
        'comments',
        'patient_id',
        'appointment_id',
        'patient_visit_record_id',
        'doctor_id'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id')->withTrashed();
    }


    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }


    public function patientVisitRecord()
    {
        return $this->belongsTo(PatientVisitRecord::class, 'patient_visit_record_id');
    }
}