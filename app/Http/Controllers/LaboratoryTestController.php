<?php

namespace App\Http\Controllers;

use App\Models\LaboratoryTest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaboratoryTestController extends Controller
{
    public function index(Request $request)
    {
        // Fetch all laboratory tests from the database
        $tests = LaboratoryTest::all()->map(function ($test) {
            return [
                'id' => $test->id,
                'name' => $test->name,
                'status' => $test->status,
            ];
        })->toArray();

        // Handle manual pagination
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('perPage', 10);
        $total = count($tests);
        $lastPage = ceil($total / $perPage);

        $paginatedData = array_slice($tests, ($page - 1) * $perPage, $perPage);

        return Inertia::render('Sidebar/LaboratoryTestList', [
            'tests' => [
                'data' => $paginatedData,
                'current_page' => $page,
                'per_page' => $perPage,
                'last_page' => $lastPage,
                'total' => $total,
                'prev_page_url' => $page > 1 ? route('laboratory-test', ['page' => $page - 1, 'perPage' => $perPage]) : null,
                'next_page_url' => $page < $lastPage ? route('laboratory-test', ['page' => $page + 1, 'perPage' => $perPage]) : null,
            ],
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:laboratory_tests',
        ]);

        LaboratoryTest::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, LaboratoryTest $test)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:laboratory_tests,name,' . $test->id,
        ]);

        $test->update($validated);

        return redirect()->back();
    }

    public function destroy(LaboratoryTest $test)
    {
        $test->delete();

        return redirect()->back();
    }
}