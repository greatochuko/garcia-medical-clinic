<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'middleInitial' => 'nullable|string|max:10',
            'licenseNumber' => 'required|string|unique:doctors,license_number',
            'ptrNumber' => 'nullable|string',
            'loginId' => 'required|string|unique:users,username',
            'password' => 'required|string|min:8',
        ]);

        try {
            DB::beginTransaction();

            // Create user account
            $user = User::create([
                'username' => $validated['loginId'],
                'password' => Hash::make($validated['password']),
                'role' => 'doctor',
                'status' => 'active'
            ]);

            // Create doctor profile
            $doctor = Doctor::create([
                'user_id' => $user->id,
                'first_name' => $validated['firstName'],
                'last_name' => $validated['lastName'],
                'middle_initial' => $validated['middleInitial'],
                'license_number' => $validated['licenseNumber'],
                'ptr_number' => $validated['ptrNumber'],
            ]);

            DB::commit();

            return redirect()->route('users.index')->with('success', 'Doctor account created successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create doctor account. Please try again.']);
        }
    }

    public function update(Request $request, Doctor $doctor)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'middleInitial' => 'nullable|string|max:10',
            'licenseNumber' => 'required|string|unique:doctors,license_number,' . $doctor->id,
            'ptrNumber' => 'nullable|string',
            'loginId' => 'required|string|unique:users,username,' . $doctor->user_id,
            'password' => 'nullable|string|min:8',
        ]);

        try {
            DB::beginTransaction();

            // Update user account
            $userData = [
                'username' => $validated['loginId'],
            ];

            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $doctor->user->update($userData);

            // Update doctor profile
            $doctor->update([
                'first_name' => $validated['firstName'],
                'last_name' => $validated['lastName'],
                'middle_initial' => $validated['middleInitial'],
                'license_number' => $validated['licenseNumber'],
                'ptr_number' => $validated['ptrNumber'],
            ]);

            DB::commit();

            return back()->with('success', 'Doctor account updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update doctor account. Please try again.']);
        }
    }

    public function destroy(Doctor $doctor)
    {
        try {
            DB::beginTransaction();

            // Delete the user account (this will cascade to doctor profile if set up in migration)
            $doctor->user->delete();
            
            DB::commit();

            return redirect()->route('users.index')->with('success', 'Doctor account deleted successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to delete doctor account. Please try again.']);
        }
    }
} 