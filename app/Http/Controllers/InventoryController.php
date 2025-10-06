<?php

namespace App\Http\Controllers;

use App\Models\MedicationList;
use Inertia\Inertia;


class InventoryController extends Controller
{
    public function index()
    {
        $medications = MedicationList::all();
        return Inertia::render('Inventory', ['medications' => $medications]);
    }
}
