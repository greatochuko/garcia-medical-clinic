<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'month',
        'electricity',
        'water',
        'internet',
        'salary',
        'rent',
        'total'
    ];

    // Cast fields to numeric types
    protected $casts = [
        'year' => 'integer',
        'month' => 'integer',
        'electricity' => 'float',
        'water' => 'float',
        'internet' => 'float',
        'salary' => 'float',
        'rent' => 'float',
        'total' => 'float',
    ];

    protected static function booted()
    {
        static::saving(function ($expense) {
            $expense->total =
                $expense->electricity +
                $expense->water +
                $expense->internet +
                $expense->salary +
                $expense->rent;
        });
    }
}
