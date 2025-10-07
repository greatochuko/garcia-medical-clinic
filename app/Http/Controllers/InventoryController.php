<?php

namespace App\Http\Controllers;

use App\Models\MedicationList;
use Illuminate\Http\Request;
use Inertia\Inertia;


class InventoryController extends Controller
{
    public function index()
    {
        $medications = MedicationList::all();
        return Inertia::render('Inventory', ['medications' => $medications]);
    }

    public function add(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'price' => 'required|numeric|min:1',
                'quantity' => 'required|numeric',
                'controlled' => 'required|boolean',
            ]);

            MedicationList::create($validated);

            return redirect()
                ->back()
                ->with('success', 'Medication added successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()
                ->back()
                ->withErrors($e->validator)
                ->withInput();
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors('error', 'An unexpected error occurred: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'price' => 'required|numeric|min:1',
                'quantity' => 'required|numeric',
                'controlled' => 'required|boolean',
            ]);

            $medication = MedicationList::findOrFail($id);
            $medication->update($validated);

            return redirect()
                ->back()
                ->with('success', 'Medication updated successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()
                ->back()
                ->withErrors($e->validator)
                ->withInput();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()
                ->back()
                ->with('error', 'Medication not found.')
                ->withInput();
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'An unexpected error occurred: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function delete($id)
    {
        try {
            $medication = MedicationList::findOrFail($id);
            $medication->delete();

            return redirect()
                ->back()
                ->with('success', 'Medication deleted successfully.');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()
                ->back()
                ->with('error', 'Medication not found.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'An unexpected error occurred: ' . $e->getMessage());
        }
    }
}
