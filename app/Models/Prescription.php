<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Prescription extends Model
{
    protected $fillable = [
        'patient_name',
        'address',
        'age',
        'sex',
        'date',
        'doctor_name',
        'license_no',
        'ptr_no'
    ];

    protected $casts = [
        'date' => 'datetime',
        'medications' => 'array'
    ];

    public function medications(): HasMany
    {
        return $this->hasMany(Medication::class);
    }
} 