<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;


class PlanController extends Controller
{
    public function index(Request $request)
    {
        //  // Default to 10 items per page if not specified
        //  $perPage = (int) $request->input('perPage', 10);
        //  $page = (int) $request->input('page', 1);

        //  $frequencies = [
        //      ['id' => 1, 'name' => 'once a day'],
        //      ['id' => 2, 'name' => '2 x a day'],
        //      ['id' => 3, 'name' => '3 x a day'],
        //      ['id' => 4, 'name' => '4 x a day'],
        //      ['id' => 5, 'name' => 'every 4 hours'],
        //      ['id' => 6, 'name' => 'every 6 hours'],
        //      ['id' => 7, 'name' => 'every 8 hours'],
        //      ['id' => 8, 'name' => 'every 12 hours'],
        //      ['id' => 9, 'name' => 'as needed for pain'],
        //      ['id' => 10, 'name' => 'before meals'],
        //      ['id' => 11, 'name' => 'after meals'],
        //      ['id' => 12, 'name' => 'before bed'],
        //      ['id' => 13, 'name' => 'in the morning'],
        //      ['id' => 14, 'name' => 'at night'],
        //      ['id' => 15, 'name' => 'with meals'],
        //  ];

        //  // Convert array to collection
        //  $collection = collect($frequencies);

        //  // Get total count
        //  $total = $collection->count();

        //  // Get current page items
        //  $currentPageItems = $collection->forPage($page, $perPage)->values();

        //  // Create paginator instance
        //  $paginator = new LengthAwarePaginator(
        //      $currentPageItems,
        //      $total,
        //      $perPage,
        //      $page,
        //      [
        //          'path' => $request->url(),
        //          'query' => $request->query()
        //      ]
        //  );

        //  return Inertia::render('Sidebar/PlanList', [
        //      'plans' => [
        //          'data' => $paginator->items(),
        //          'current_page' => $paginator->currentPage(),
        //          'per_page' => $paginator->perPage(),
        //          'last_page' => $paginator->lastPage(),
        //          'total' => $paginator->total(),
        //          'prev_page_url' => $paginator->previousPageUrl(),
        //          'next_page_url' => $paginator->nextPageUrl(),
        //      ]
        //  ]);

        $services = Plan::all()->map(function ($service) {
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

        return Inertia::render('Sidebar/PlanList', [
            'plans' => [
                'data' => $paginatedData,
                'current_page' => $page,
                'per_page' => $perPage,
                'last_page' => $lastPage,
                'total' => $total,
                'prev_page_url' => $page > 1 ? route('plan-list', ['page' => $page - 1, 'perPage' => $perPage]) : null,
                'next_page_url' => $page < $lastPage ? route('plan-list', ['page' => $page + 1, 'perPage' => $perPage]) : null,
            ],
            'auth' => [
                'user' => auth()->user(),
                'role' => 'secretary',
            ],
        ]);
    }

    public function planlist()
    {
        $plans = Plan::all();
        return $plans;
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);
        $existingPlan = Plan::whereRaw('LOWER(name) = ?', [strtolower($request->name)])->first();

        if (!$existingPlan) {
            Plan::create($request->all());
        }

        return redirect()->back()->with('success', 'Plan created successfully.');
    }

    public function update(Request $request, $id)
    {
        $plan = Plan::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);
        $existingPlan = Plan::whereRaw('LOWER(name) = ?', [strtolower($request->name)])->first();
        if (!$existingPlan) {
            $plan->update($request->all());
        }
    

        return redirect()->back()->with('success', 'Plan updated successfully.');
    }

    public function destroy($id)
    {
        $plan = Plan::findOrFail($id);
        $plan->delete();
        return redirect()->back()->with('success', 'Plan deleted successfully.');
    }
}
