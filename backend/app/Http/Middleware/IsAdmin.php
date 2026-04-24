<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()->userType !== 'admin') {
            return response()->json([
                'message' => 'Accés no autoritzat'
            ], 403);
        }

        return $next($request);
    }
}
