<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando'
    ]);
});
/*
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);

Route::post('/categories', [CategoryController::class, 'store']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
*/
Route::apiResource('categories', CategoryController::class);
Route::apiResource('products', ProductController::class);
