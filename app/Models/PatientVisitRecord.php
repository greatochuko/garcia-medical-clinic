<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientVisitRecord extends Model
{
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'appointment_id',
        'is_closed',
        'chief_complaints',
        'physical_exams',
        'plans',
        'diagnoses',
        'diagnostic_results',
    ];

    protected $casts = [
        'is_closed' => 'boolean',
        'chief_complaints' => 'array',
        'physical_exams' => 'array',
        'plans' => 'array',
        'diagnoses' => 'array',
        'diagnostic_results' => 'array',
        'prescribed_medications' => 'array',
    ];

    /**
     * Set default values for JSON attributes.
     */
    protected $attributes = [
        'chief_complaints' => '[]',
        'physical_exams' => '[]',
        'plans' => '[]',
        'diagnoses' => '[]',
        'diagnostic_results' => '[]',
    ];

    // Relationships
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class);
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function labRequest()
    {
        return $this->hasMany(LaboratoryRequest::class);
    }

    public function prescriptions()
    {
        return $this->hasMany(PatientPrescription::class);
    }

    public function medicalCertificate()
    {
        return $this->hasOne(MedicalCertificate::class);
    }
}
