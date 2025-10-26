<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryChange extends Model
{
    use HasFactory;

    protected $fillable = [
        'medication_id',
        'user_id',
        'lastRunDate',
        'entryDetails',
        'quantity',
        'expiryDate',
        'newTotal',
    ];

    public function medication()
    {
        return $this->belongsTo(MedicationList::class, 'medication_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
