<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Billing extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient',
        'service',
        'prescriptions',
        'total',
        'discount',
        'final_total',
        'paid',
    ];

    protected $casts = [
        'patient' => 'array',
        'service' => 'array',
        'prescriptions' => 'array',
    ];
}
