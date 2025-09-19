<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\MedicationList;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class MedicationListController extends Controller
{
    public function index(Request $request)
    {
        $medications = MedicationList::all()->map(function ($medication) {
            return [
                'id' => $medication->id,
                'name' => $medication->name,
            ];
        })->toArray();

        // Handle manual pagination
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('perPage', 10);
        $total = count($medications);
        $lastPage = ceil($total / $perPage);

        $paginatedData = array_slice($medications, ($page - 1) * $perPage, $perPage);

        return Inertia::render('Sidebar/MedicationList', [
            'medications' => [
                'data' => $paginatedData,
                'current_page' => $page,
                'per_page' => $perPage,
                'last_page' => $lastPage,
                'total' => $total,
                'prev_page_url' => $page > 1 ? route('medication-list', ['page' => $page - 1, 'perPage' => $perPage]) : null,
                'next_page_url' => $page < $lastPage ? route('medication-list', ['page' => $page + 1, 'perPage' => $perPage]) : null,
            ],
            'auth' => [
                'user' => auth()->user(),
                'role' => 'secretary',
            ],
        ]);
    }

    public function getlist(){
        $medications = MedicationList::all();
        return response()->json([
        'success' => true,
        'data' => $medications,
    ]);
        return $medications;
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Create new medication
        $medication = MedicationList::create($validated);

        return redirect()->route('medication-list')->with('success', 'Medication added successfully');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $medication = MedicationList::findOrFail($id);
        $medication->update($validated);

        return redirect()->route('medication-list')->with('success', 'Medication updated successfully');
    }

    public function destroy($id)
    {
        $medication = MedicationList::findOrFail($id);
        $medication->delete();

        return redirect()->route('medication-list')->with('success', 'Medication deleted successfully');
    }
}