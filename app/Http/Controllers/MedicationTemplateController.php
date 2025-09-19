<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\MedicationTemplate;
use App\Models\MedicationSubTemplates;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\ListMedicationTemplete;

class MedicationTemplateController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('perPage', 10);
        $page = (int) $request->input('page', 1);

        $templates = MedicationTemplate::query()
            ->orderBy('name')
            ->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('Sidebar/Index', [
            'templates' => [
                'data' => $templates->items(),
                'current_page' => $templates->currentPage(),
                'per_page' => $templates->perPage(),
                'last_page' => $templates->lastPage(),
                'total' => $templates->total(),
                'prev_page_url' => $templates->previousPageUrl(),
                'next_page_url' => $templates->nextPageUrl(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'set_id' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Create new template
        $template = MedicationTemplate::create([
            'name' => $validated['name'],
            'set_id' => $validated['set_id'] ?? 'SET-' . rand(100000, 999999),
            'description' => $validated['description'] ?? null,
            'medications' => json_encode([]),
        ]);

        return redirect()->route('medication-templates')->with('success', 'Template created successfully');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'set_id' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $template = MedicationTemplate::findOrFail($id);
        $template->update([
            'name' => $validated['name'],
            'set_id' => $validated['set_id'],
            'description' => $validated['description'] ?? $template->description,
        ]);

        return redirect()->route('medication-templates')->with('success', 'Template updated successfully');
    }

    public function getMedicationsList($template_id)
    {
        // dd($template_id);
        $medications = ListMedicationTemplete::with('medicationTemplate')->where('medication_template_id', $template_id)->get();
        return response()->json($medications);
    }

    public function saveMedication(Request $request, $templateId)
    {
        $validated = $request->validate([
            'medication_name' => 'required|string|max:255',
            'dosage' => 'required|string|max:255',
            'frequency' => 'required|string|max:255',
            'duration' => 'nullable|string|max:255',
            'amount' => 'required|string|max:255',
        ]);

        $medication = ListMedicationTemplete::create([
            'medication_template_id' => $templateId,
            'medication_name' => $validated['medication_name'],
            'dosage' => $validated['dosage'],
            'frequency' => $validated['frequency'],
            'duration' => $validated['duration'],
            'amount' => $validated['amount'],
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'medication' => $medication
            ]);
        }

        return redirect()->back();
    }
    public function getMedicationsTemp_List()
    {
        $medications = MedicationTemplate::all();
        return response()->json($medications);
    }

    public function deleteListMedication($templateId, $medicationId)
    {
        if ($medicationId) {
            $medication = ListMedicationTemplete::findOrFail($medicationId);
            $medication->delete();
        }
        
        // return response()->json(['success' => 'Medication deleted successfully']);
    }

    public function destroy($id)
    {
        $template = MedicationTemplate::findOrFail($id);
        $template->delete();
        
        return redirect()->route('medication-templates')->with('success', 'Template deleted successfully');
    }

    public function get_medication_templates($id){
     $medication_subtemplates = MedicationSubTemplates::where('medication_template_id' , $id)->get();
     return $medication_subtemplates;
    }

    public function updateMedication(Request $request, $templateId, $medicationId)
    {
        $validated = $request->validate([
            'medication_name' => 'required|string|max:255',
            'dosage' => 'required|string|max:255',
            'frequency' => 'required|string|max:255',
            'duration' => 'nullable|string|max:255',
            'amount' => 'required|string|max:255',
        ]);

        $medication = ListMedicationTemplete::findOrFail($medicationId);
        $medication->update([
            'medication_name' => $validated['medication_name'],
            'dosage' => $validated['dosage'],
            'frequency' => $validated['frequency'],
            'duration' => $validated['duration'],
            'amount' => $validated['amount'],
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'medication' => $medication
            ]);
        }

        return redirect()->back();
    }
}