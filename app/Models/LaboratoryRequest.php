<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\PatientVisitRecord;

class LaboratoryRequest extends Model
{
    protected $table = 'laboratory_requests';

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'appointment_id',
        'test_name',
        'others',
        'patient_visit_record_id',
    ];

    // One lab request belongs to a patient visit record
    public function patientVisitRecord()
    {
        return $this->belongsTo(PatientVisitRecord::class);
    }
}
