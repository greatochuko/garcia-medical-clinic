<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalHistory extends Model
{

    use HasFactory;
    protected $table = 'patient_medical_history';
    protected $fillable = [
        'patient_id',
        'disease'
    ];
}
