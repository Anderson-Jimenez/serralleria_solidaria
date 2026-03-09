<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando'
    ]);
});

Route::get('/categories', [CategoryController::class, 'index']);