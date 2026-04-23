<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request){
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        // Intenta login con username o email
        $credentials = filter_var($request->username, FILTER_VALIDATE_EMAIL)
            ? ['email' => $request->username, 'password' => $request->password]
            : ['username'  => $request->username, 'password' => $request->password];

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        $user  = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'userType'     => $user->userType, // o el campo que uses: 'admin', 'user'...
            'user'         => [
                'id'    => $user->id,
                'username'  => $user->username,
                'email' => $user->email,
            ]
        ]);
    }

    public function logout(Request $request){
        // Elimina el token actual del servidor
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada']);
    }

    public function me(Request $request){
        return response()->json($request->user());
    }
}
