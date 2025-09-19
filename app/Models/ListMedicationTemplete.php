<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListMedicationTemplete extends Model
{
    use HasFactory;

    protected $table = 'list_medication_templete';

    protected $fillable = [
        'medication_template_id',
        'medication_name',
        'dosage',
        'frequency',
        'duration',
        'amount',
    ];

    public function medicationTemplate()
    {
        return $this->belongsTo(MedicationTemplate::class, 'medication_template_id');
    }
} 