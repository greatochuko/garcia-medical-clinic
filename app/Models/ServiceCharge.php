<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceCharge extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'charge',
        'patient_type',
        'description'
    ];

    protected $casts = [
        'charge' => 'decimal:2',
        'patient_type' => 'integer',
    ];
} 