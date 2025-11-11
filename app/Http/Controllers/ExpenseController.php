<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        return Expense::orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer|min:1|max:12',
            'electricity' => 'nullable|numeric',
            'water' => 'nullable|numeric',
            'internet' => 'nullable|numeric',
            'salary' => 'nullable|numeric',
            'rent' => 'nullable|numeric',
        ]);

        // Create or update the monthly expense
        $expense = Expense::updateOrCreate(
            [
                'year' => $data['year'],
                'month' => $data['month'],
            ],
            $data
        );

        return response()->json([
            'message' => 'Expense saved successfully',
            'data' => $expense
        ]);
    }
}
