<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FrequencyList;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class FrequencyListController extends Controller
{
    public function index(Request $request)
    {
        $services = FrequencyList::all()->map(function ($service) {
            return [
                'id' => $service->id,
                'name' => $service->name,
            ];
        })->toArray();

        // Handle manual pagination
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('perPage', 10);
        $total = count($services);
        $lastPage = ceil($total / $perPage);

        $paginatedData = array_slice($services, ($page - 1) * $perPage, $perPage);

        return Inertia::render('Sidebar/FrequencyList', [
            'frequencies' => [
                'data' => $paginatedData,
                'current_page' => $page,
                'per_page' => $perPage,
                'last_page' => $lastPage,
                'total' => $total,
                'prev_page_url' => $page > 1 ? route('frequency-list', ['page' => $page - 1, 'perPage' => $perPage]) : null,
                'next_page_url' => $page < $lastPage ? route('frequency-list', ['page' => $page + 1, 'perPage' => $perPage]) : null,
            ],
            'auth' => [
                'user' => auth()->user(),
                'role' => 'secretary',
            ],
        ]);


        // return Inertia::render('Sidebar/FrequencyList', [
        //     'frequencies' => [
        //         'data' => $paginator->items(),
        //         'current_page' => $paginator->currentPage(),
        //         'per_page' => $paginator->perPage(),
        //         'last_page' => $paginator->lastPage(),
        //         'total' => $paginator->total(),
        //         'prev_page_url' => $paginator->previousPageUrl(),
        //         'next_page_url' => $paginator->nextPageUrl(),
        //     ]
        // ]);
    }

    public function getlist(){
         $frequency = FrequencyList::all();
        return response()->json([
        'success' => true,
        'data' => $frequency,
    ]);
        return $frequency;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Create new frequency
        $frequency = FrequencyList::create($validated);

        return redirect()->route('frequency-list')->with('success', 'Frequency added successfully');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $frequency = FrequencyList::findOrFail($id);
        $frequency->update($validated);

        return redirect()->route('frequency-list')->with('success', 'Frequency updated successfully');
    }

    public function destroy($id)
    {
        $frequency = FrequencyList::findOrFail($id);
        $frequency->delete();

        return redirect()->route('frequency-list')->with('success', 'Frequency deleted successfully');
    }
} 