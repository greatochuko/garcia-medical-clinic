<?php

namespace App\Http\Controllers;

use App\Models\PhysicalExam;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PhysicalExamController extends Controller
{
    public function index(Request $request)
    {
        $exams = PhysicalExam::all()->map(function ($exam) {
            return [
                'id' => $exam->id,
                'name' => $exam->name,
            ];
        })->toArray();

        // Manual pagination
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('perPage', 10);
        $total = count($exams);
        $lastPage = ceil($total / $perPage);

        $paginatedData = array_slice($exams, ($page - 1) * $perPage, $perPage);

        return Inertia::render('Sidebar/PhysicalExamList', [
            'exams' => [
                'data' => $paginatedData,
                'current_page' => $page,
                'per_page' => $perPage,
                'last_page' => $lastPage,
                'total' => $total,
                'prev_page_url' => $page > 1 ? route('physical-exam-list', ['page' => $page - 1, 'perPage' => $perPage]) : null,
                'next_page_url' => $page < $lastPage ? route('physical-exam-list', ['page' => $page + 1, 'perPage' => $perPage]) : null,
            ],
            'auth' => [
                'user' => auth()->user(),
                'role' => 'secretary',
            ],
        ]);
    }

    public function examlist()
    {
        return PhysicalExam::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $existingExam = PhysicalExam::whereRaw('LOWER(name) = ?', [strtolower($request->name)])->first();

        if (!$existingExam) {
            PhysicalExam::create($request->all());
        }

        return redirect()->back()->with('success', 'Physical Exam created successfully.');
    }

    public function update(Request $request, $id)
    {
        $exam = PhysicalExam::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $existingExam = PhysicalExam::whereRaw('LOWER(name) = ?', [strtolower($request->name)])->first();

        if (!$existingExam) {
            $exam->update($request->all());
        }

        return redirect()->back()->with('success', 'Physical Exam updated successfully.');
    }

    public function destroy($id)
    {
        $exam = PhysicalExam::findOrFail($id);
        $exam->delete();

        return redirect()->back()->with('success', 'Physical Exam deleted successfully.');
    }
}
