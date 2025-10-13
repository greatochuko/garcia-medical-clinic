<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class UserAccountController extends Controller
{
    public function show(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('page', 1);

        // Query users with their doctor relationship
        $users = User::with('doctor')
            ->select('users.*')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // Transform the data to match the expected format
        $transformedUsers = $users->map(function ($user) {
            $fullName = $user->full_name;

            // Add MD suffix for doctors
            if ($user->isDoctor() && $user->doctor) {
                $fullName .= ', MD';
            }

            return [
                'id' => $user->id,
                'name' => $fullName,
                'role' => ucfirst($user->role),
                'registration_date' => $user->created_at->format('F d, Y')
            ];
        });

        // Format the data for the response
        $paginatedData = [
            'data' => $transformedUsers,
            'current_page' => $users->currentPage(),
            'per_page' => $perPage,
            'last_page' => $users->lastPage(),
            'total' => $users->total(),
            'prev_page_url' => $users->previousPageUrl(),
            'next_page_url' => $users->nextPageUrl(),
        ];

        return Inertia::render('UserAccounts', [
            'auth' => ['user' => Auth::user()],
            'users' => $paginatedData
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('UserForm', [
            'auth' => ['user' => Auth::user()],
            'role' => $request->query('role', 'doctor')
        ]);
    }

    public function store(Request $request)
    {
        try {
            // Log incoming request data
            Log::info('Store User Request Data:', $request->all());

            // Base validation rules
            $rules = [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'middle_initial' => 'nullable|string|max:10',
                'login_id' => 'required|string|unique:users,login_id',
                'password' => 'required|string|min:8',
                'role' => 'required|string|in:doctor,admin,secretary',
                'avatar_url' => 'required|string'
            ];

            // Add doctor-specific validation rules only if role is doctor
            if ($request->input('role') === 'doctor') {
                $rules['license_number'] = 'required|string|unique:doctors,license_number';
                $rules['ptr_number'] = 'nullable|string';
            }

            $validated = $request->validate($rules);

            DB::beginTransaction();

            // Create user account
            $user = User::create([
                'login_id' => $validated['login_id'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'status' => 'active',
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'avatar_url' => $validated['avatar_url'],
                'middle_initial' => $validated['middle_initial']
            ]);

            Log::info('Created User:', $user->toArray());

            // If the role is doctor, create doctor profile
            if ($validated['role'] === 'doctor') {
                $doctor = Doctor::create([
                    'user_id' => $user->id,
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'middle_initial' => $validated['middle_initial'],
                    'license_number' => $validated['license_number'],
                    'ptr_number' => $validated['ptr_number'] ?? null,
                ]);
                Log::info('Created Doctor:', $doctor->toArray());
            }

            DB::commit();
            return redirect()->route('settings.accounts')->with('success', 'User account created successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Validation Error:', ['errors' => $e->errors()]);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating user:', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to create user account: ' . $e->getMessage()])->withInput();
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            // Log incoming request data
            Log::info('Update User Request Data:', [
                'user_id' => $id,
                'request_data' => $request->all()
            ]);

            // Base validation rules
            $rules = [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'middle_initial' => 'nullable|string|max:10',
                'login_id' => 'required|string|unique:users,login_id,' . $user->id,
                'role' => 'required|string|in:doctor,admin,secretary'
                // 'password' => 'nullable|string|min:8',
            ];

            // Add doctor-specific validation rules only if role is doctor
            if ($request->input('role') === 'doctor') {
                $rules['license_number'] = [
                    'required',
                    'string',
                    'unique:doctors,license_number,' . ($user->doctor ? $user->doctor->id : 'NULL') . ',id'
                ];
                $rules['ptr_number'] = 'nullable|string';
            }

            $validated = $request->validate($rules);

            DB::beginTransaction();

            // Update user account
            $userData = [
                'login_id' => $validated['login_id'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'middle_initial' => $validated['middle_initial']
            ];

            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $user->update($userData);
            Log::info('Updated User:', $userData);

            // Handle doctor profile
            if ($validated['role'] === 'doctor') {
                $doctorData = [
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'middle_initial' => $validated['middle_initial'],
                    'license_number' => $validated['license_number'],
                    'ptr_number' => $validated['ptr_number'] ?? null,
                ];

                if ($user->doctor) {
                    // Update existing doctor profile
                    $user->doctor->update($doctorData);
                    Log::info('Updated Doctor:', $doctorData);
                } else {
                    // Create new doctor profile
                    $doctor = Doctor::create(array_merge($doctorData, ['user_id' => $user->id]));
                    Log::info('Created Doctor:', $doctor->toArray());
                }
            } elseif ($user->doctor) {
                // If user was a doctor but role changed, delete doctor profile
                $user->doctor->delete();
                Log::info('Deleted Doctor Profile for user:', ['user_id' => $user->id]);
            }

            DB::commit();
            return redirect()->route('settings.accounts')->with('success', 'User account updated successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Validation Error:', ['errors' => $e->errors()]);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating user:', [
                'user_id' => $id,
                'error' => $e->getMessage()
            ]);
            return back()->withErrors(['error' => 'Failed to update user account: ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $user = User::findOrFail($id);
            Log::info('Deleting user:', ['user_id' => $id]);

            // Delete doctor profile first if exists
            if ($user->doctor) {
                $user->doctor->delete();
                Log::info('Deleted doctor profile:', ['user_id' => $id]);
            }

            // Delete user
            $user->delete();

            DB::commit();
            return redirect()->back()->with('success', 'User account deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting user:', [
                'user_id' => $id,
                'error' => $e->getMessage()
            ]);
            return back()->withErrors(['error' => 'Failed to delete user account: ' . $e->getMessage()]);
        }
    }

    public function edit($id)
    {
        try {
            $user = User::with('doctor')->findOrFail($id);

            $userData = [
                'id' => $user->id,
                'first_name' =>  $user->first_name,
                'last_name' =>  $user->last_name,
                'middle_initial' => $user->middle_initial,
                'license_number' => $user->doctor ? $user->doctor->license_number : '',
                'ptr_number' => $user->doctor ? $user->doctor->ptr_number : '',
                'login_id' => $user->login_id,
                'role' => $user->role
            ];
            // echo "<pre>";
            // print_r($user->first_name);exit;

            Log::info('Editing user:', $userData);

            return Inertia::render('UserForm', [
                'auth' => ['user' => Auth::user()],
                'user' => $userData,
                'role' => $user->role,
                'isEditing' => true
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading user for edit:', [
                'user_id' => $id,
                'error' => $e->getMessage()
            ]);
            return redirect()->route('users.index')->with('error', 'User not found');
        }
    }
}
