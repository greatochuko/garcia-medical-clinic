<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicationList extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'price',
        'quantity',
        'controlled',
        'lastRunDate',
        'expirationDate',
    ];

    protected $casts = [
        'lastRunDate' => 'date',
        'expirationDate' => 'date',
    ];

    public function prescriptions()
    {
        return $this->hasMany(PatientPrescription::class, 'medication_id');
    }
}
