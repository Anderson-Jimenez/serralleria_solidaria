<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return User::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $validated = $request->validate([
                'username' => 'required|string|max:50|unique:users,username',
                'email'    => 'required|email|unique:users,email',
                'phone'    => 'nullable|digits:9',
                'userType' => 'required',
                'password' => 'required|min:8',
            ]);

            User::Create([
                'username' => $validated['username'],
                'email'    => $validated['email'],
                'phone'    => $validated['phone'],
                'userType' => $validated['userType'],
                'password' => Hash::make($validated['password']),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Usuari creat correctament'
            ], 201);
        } 
        
        catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage()
            ], 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return User::findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return User::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $user = User::findOrFail($id);

            $validated = $request->validate([
                'username' => 'required|string|max:50|unique:users,username,' . $id,
                'email'    => 'required|email|unique:users,email,' . $id,
                'phone'    => 'nullable|digits:9',
                'userType' => 'required',
                'password' => 'nullable|min:8',
            ]);

            $updatedData = [
                'username' => $validated['username'],
                'email'    => $validated['email'],
                'phone'    => $validated['phone'],
                'userType' => $validated['userType'],
            ];

            if (!empty($validated['password'])) {
                $updatedData['password'] = Hash::make($validated['password']);
            }

            $user->update($updatedData);

            return response()->json([
                'success' => true,
                'message' => 'Usuari actualitzat correctament'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function searchUsers($text)
    {
        try {
            if($text===""){
                $users = User::all();
            }
            else{
                $users = User::where('username', 'LIKE','%' . $text . '%')
                                ->orWhere('email', 'LIKE', '%' . $text . '%')
                                ->orWhere('phone', 'LIKE', '%' . $text . '%')
                                ->get();
            }

            return response()->json([
                'success' => true,
                'users' => $users,
                'message' => 'Usuaris passan',
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al buscar el camp',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function countUsers(){
        try {
            $users= User::count();

            return response()->json([
                'success' => true,
                'users' => $users,
                'message' => 'Passat num de usuaris'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'error en contar els usuaris',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
