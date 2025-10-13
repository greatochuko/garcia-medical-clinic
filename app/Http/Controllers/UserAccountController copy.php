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

class UserAccountController extends Controller
{
    public function show(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('page', 1);

        $users = [
            [
                'id' => 1,
                'name' => 'Royce V. Garcia Jr. MD',
                'role' => 'Doctor',
                'registration_date' => 'November 27, 2025'
            ],
            [
                'id' => 2,
                'name' => 'Ariel May B. Garcia, MT-MD',
                'role' => 'Doctor',
                'registration_date' => 'November 27, 2025'
            ],
            [
                'id' => 3,
                'name' => 'Angelica B. Garcia',
                'role' => 'Secretary',
                'registration_date' => 'November 27, 2025'
            ],
            [
                'id' => 4,
                'name' => 'Gibby B. Garcia',
                'role' => 'Admin',
                'registration_date' => 'November 27, 2025'
            ],
            [
                'id' => 5,
                'name' => 'Victor James V. Galdones, RMT-MD',
                'role' => 'Doctor',
                'registration_date' => 'November 27, 2025'
            ],
            [
                'id' => 6,
                'name' => 'dummy data from controller',
                'role' => 'admin',
                'registration_date' => 'November 27, 2025'
            ],
            [
                'id' => 7,
                'name' => 'dummy data from controller',
                'role' => 'doctor',
                'registration_date' => 'November 27, 2025'
            ],
            [
                'id' => 8,
                'name' => 'dummy data from controller',
                'role' => 'doctor',
                'registration_date' => 'November 27, 2025'
            ],
        ];

        // Convert the array to a collection
        $collection = Collection::make($users);

        // Create a paginator instance
        $paginator = new LengthAwarePaginator(
            $collection->forPage($page, $perPage),
            $collection->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        // Format the data for the response
        $paginatedData = [
            'data' => $paginator->items(),
            'current_page' => $paginator->currentPage(),
            'per_page' => $perPage,
            'last_page' => $paginator->lastPage(),
            'total' => $paginator->total(),
            'prev_page_url' => $paginator->previousPageUrl(),
            'next_page_url' => $paginator->nextPageUrl(),
        ];

        return Inertia::render('UserAccounts', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'users' => $paginatedData
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('UserForm', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'role' => $request->query('role', 'doctor') // Default to 'doctor' if no role is specified
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'middleInitial' => 'nullable|string|max:10',
            'licenseNumber' => 'required_if:role,doctor|string|unique:doctors,license_number',
            'ptrNumber' => 'nullable|string',
            'loginId' => 'required|string|unique:users,username',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:doctor,admin,secretary'
        ]);

        try {
            DB::beginTransaction();

            // Create user account
            $user = User::create([
                'username' => $validated['loginId'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'status' => 'active'
            ]);

            // If the role is doctor, create doctor profile
            if ($validated['role'] === 'doctor') {
                Doctor::create([
                    'user_id' => $user->id,
                    'first_name' => $validated['firstName'],
                    'last_name' => $validated['lastName'],
                    'middle_initial' => $validated['middleInitial'],
                    'license_number' => $validated['licenseNumber'],
                    'ptr_number' => $validated['ptrNumber'],
                ]);
            }

            DB::commit();

            return redirect()->route('users.index')->with('success', 'User account created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create user account. Please try again.']);
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'middleInitial' => 'nullable|string|max:10',
            'licenseNumber' => 'required_if:role,doctor|string|unique:doctors,license_number,' . ($user->doctor->id ?? ''),
            'ptrNumber' => 'nullable|string',
            'loginId' => 'required|string|unique:users,username,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|string|in:doctor,admin,secretary'
        ]);

        try {
            DB::beginTransaction();

            // Update user account
            $userData = [
                'username' => $validated['loginId'],
                'role' => $validated['role']
            ];

            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $user->update($userData);

            // Handle doctor profile
            if ($validated['role'] === 'doctor') {
                if ($user->doctor) {
                    // Update existing doctor profile
                    $user->doctor->update([
                        'first_name' => $validated['firstName'],
                        'last_name' => $validated['lastName'],
                        'middle_initial' => $validated['middleInitial'],
                        'license_number' => $validated['licenseNumber'],
                        'ptr_number' => $validated['ptrNumber'],
                    ]);
                } else {
                    // Create new doctor profile
                    Doctor::create([
                        'user_id' => $user->id,
                        'first_name' => $validated['firstName'],
                        'last_name' => $validated['lastName'],
                        'middle_initial' => $validated['middleInitial'],
                        'license_number' => $validated['licenseNumber'],
                        'ptr_number' => $validated['ptrNumber'],
                    ]);
                }
            } elseif ($user->doctor) {
                // If user was a doctor but role changed, delete doctor profile
                $user->doctor->delete();
            }

            DB::commit();

            return back()->with('success', 'User account updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update user account. Please try again.']);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            DB::beginTransaction();

            // This will cascade delete related records if set up in migration
            $user->delete();

            DB::commit();

            return redirect()->back()->with('success', 'User account deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to delete user account. Please try again.']);
        }
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        $userData = [
            'id' => $user->id,
            'firstName' => $user->doctor ? $user->doctor->first_name : '',
            'lastName' => $user->doctor ? $user->doctor->last_name : '',
            'middleInitial' => $user->doctor ? $user->doctor->middle_initial : '',
            'licenseNumber' => $user->doctor ? $user->doctor->license_number : '',
            'ptrNumber' => $user->doctor ? $user->doctor->ptr_number : '',
            'loginId' => $user->username,
            'role' => $user->role
        ];

        return Inertia::render('UserForm', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'user' => $userData,
            'role' => $user->role,
            'isEditing' => true
        ]);
    }
}
