<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ServiceCharge;
use Exception;
use Illuminate\Pagination\LengthAwarePaginator;

class ServiceChargesController extends Controller
{
    public function index(Request $request)
    {
        // Fetch all service charges from the database
        $services = ServiceCharge::all()->map(function ($service) {
            return [
                'id' => $service->id,
                'name' => $service->name,
                'charge' => number_format($service->charge, 2),
                'patient_type' => $service->patient_type == 0 ? 'Regular' : 'Senior',
            ];
        })->toArray();

        // Handle manual pagination
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('perPage', 10);
        $total = count($services);
        $lastPage = ceil($total / $perPage);

        $paginatedData = array_slice($services, ($page - 1) * $perPage, $perPage);

        return Inertia::render('Sidebar/ServiceCharges', [
            'services' => [
                'data' => $paginatedData,
                'current_page' => $page,
                'per_page' => $perPage,
                'last_page' => $lastPage,
                'total' => $total,
                'prev_page_url' => $page > 1 ? route('service-charges', ['page' => $page - 1, 'perPage' => $perPage]) : null,
                'next_page_url' => $page < $lastPage ? route('service-charges', ['page' => $page + 1, 'perPage' => $perPage]) : null,
            ],
            'auth' => [
                'user' => auth()->user(),
                'role' => 'secretary',
            ],
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'charge' => 'required|numeric|min:0',
                'patient_type' => 'required',
            ]);

            $patient_type = $request->input('patient_type') == 'Regular' ? 0 : 1;
            $validated['patient_type'] = $patient_type;
            $service = ServiceCharge::create($validated);

            return redirect()->back()->with('success', 'Service created successfully');
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
                'charge' => 'required|numeric|min:0',
                'patient_type' => 'required',
            ]);

            $service = ServiceCharge::findOrFail($id);
            $patient_type = $request->input('patient_type') == 'Regular' ? 0 : 1;
            $validated['patient_type'] = $patient_type;
            $service->update($validated);



            return redirect()->back()->with('success', 'Service updated successfully');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'An unexpected error occurred: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy($id)
    {
        $service = ServiceCharge::findOrFail($id);
        $service->delete();

        return redirect()->back()->with('success', 'Service deleted successfully');
    }
}
