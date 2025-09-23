<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Appointment;

class Patient extends Model
{
    use HasFactory;
    protected $table = 'patient_records';
    protected $fillable = [
        'patient_id',
        'first_name',
        'last_name',
        'middle_initial',
        'dob',
        'age',
        'gender',
        'patient_type',
        'phone',
        'address',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id', 'patient_id');
    }

    protected static function booted()
    {
        static::deleting(function ($patient) {
            $patient->appointments()->delete();
        });
    }

    public function vitals()
    {
        return $this->hasOne(VitalSignsModal::class, 'patient_id', 'patient_id');
    }
}
