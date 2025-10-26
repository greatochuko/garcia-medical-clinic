<?php

namespace App\Http\Controllers;

use App\Models\Billing;
use App\Models\InventoryChange;
use App\Models\MedicationList;
use Illuminate\Http\Request;
use Inertia\Inertia;


class InventoryController extends Controller
{
    public function index()
    {
        $medications = MedicationList::all();
        return Inertia::render('Inventory/Inventory', ['medications' => $medications]);
    }

    public function inventory_medication_index($id)
    {
        $billings = Billing::all();
        $totalSales = 0;

        foreach ($billings as $billing) {
            if (!empty($billing->prescriptions)) {
                foreach ($billing->prescriptions as $prescription) {
                    if (isset($prescription['medication']['id']) && $prescription['medication']['id'] == $id) {
                        $totalSales += (float) $billing->final_total;
                        break;
                    }
                }
            }
        }

        $medication = MedicationList::with(['inventoryChanges.user'])
            ->where('id', $id)
            ->first();

        return Inertia::render('Inventory/InventoryMedicationDetails', [
            'medication' => $medication,
            'totalSales' => $totalSales,
        ]);
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
                ->withErrors(['error' => 'An unexpected error occurred: ' . $e->getMessage()])
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

    public function inventory_change(Request $request, $id)
    {
        try {
            // dd($request->all());
            $rules = [
                'entryDetails' => 'required|in:Restock,Pull Out,Inventory Run Check',
                'expiryDate' => 'nullable|date|after:today',
                'previousTotal' => 'required|integer|min:0',
                'lastRunDate' => 'required|date',
            ];

            if ($request->input('entryDetails') === 'Restock') {
                $rules['quantity'] = 'required|integer|min:1';
            } else {
                $rules['quantity'] = 'required|integer|max:0';
            }

            $validated = $request->validate($rules);


            $validated['lastRunDate'] = \Carbon\Carbon::parse($validated['lastRunDate'])->format('Y-m-d');
            $validated['expiryDate'] = \Carbon\Carbon::parse($validated['expiryDate'])->format('Y-m-d');

            // Compute and attach additional fields
            $validated['newTotal'] =  $validated['previousTotal'] + $validated['quantity'];

            $validated['medication_id'] = $id;
            $validated['user_id'] = auth()->id();

            MedicationList::where('id', $id)->update([
                'quantity' => $validated['newTotal'],
                'lastRunDate' => $validated['lastRunDate'],
                'expirationDate' => $validated['expiryDate'] ?? null,
            ]);

            InventoryChange::create($validated);

            return back()->with('success', 'Inventory updated successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return validation errors without resetting form data
            return back()
                ->withErrors($e->validator)
                ->withInput();
        } catch (\Exception $e) {
            return back()
                ->with('error', 'An unexpected error occurred: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function inventory_run_check()
    {
        try {
            $medications = MedicationList::all();

            foreach ($medications as $medication) {
                InventoryChange::create([
                    'entryDetails' => 'Inventory Run Check',
                    'quantity' => 0,
                    // 'expiryDate' => $medication->expirationDate,
                    'previousTotal' => $medication->quantity,
                    'newTotal' => $medication->quantity,
                    'lastRunDate' => now()->format('Y-m-d'),
                    'medication_id' => $medication->id,
                    'user_id' => auth()->id(),
                ]);

                $medication->update([
                    'lastRunDate' => now()->format('Y-m-d'),
                ]);
            }

            return redirect()
                ->back()
                ->with('success', 'Inventory run check completed successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'An error occurred during the inventory run check: ' . $e->getMessage());
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
