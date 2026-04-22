<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class LogInController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }





    public function logIn(Request $request){
        try {
            $validated = $request->validate([
                'username' => 'required|max:100',
                'password' => 'required',
            ]);

            $user = User::where('username', $validated['username'])
                ->orWhere('email', $validated['username'])
                ->first();         
            
            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return response()->json(['message' => 'Credencials incorrectes'], 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'access_token' => $token,
                'userType' => $user->userType,
                'token_type' => 'Bearer',
                'message' => 'Log In Correcte'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Log Incorrecte',
                'error' => $e->getMessage()
            ], 500);
        }
    } 
}
