<?php

use App\Http\Controllers\CharacteristicController;
use App\Http\Controllers\CharacteristicTypeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductInPackController;
use App\Http\Controllers\HomeScreenController;
use App\Http\Controllers\ContactController;
Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando'
    ]);
});

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);

Route::post('/categories', [CategoryController::class, 'store']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

Route::apiResource('categories', CategoryController::class);
Route::get('/categories/searchCategories/{text}', [CategoryController::class, 'searchCategories']);

Route::apiResource('products', ProductController::class);
Route::get('/products/searchProducts/{text}', [ProductController::class, 'searchProducts']);
Route::post('/products/searchProductsInStore', [ProductController::class, 'searchProductsInStore']);
Route::get('/productes/getProductLatest', [ProductController::class, 'getProductLatest']);

Route::get('/products/changeState/{id}', [ProductController::class, 'changeStatusProduct']);
Route::get('/products/getProductCategory/{category}', [ProductController::class, 'getProductCategory']);
Route::get('/products/getProductCategoryLatest/{category}', [ProductController::class, 'getProductCategoryLatest']);



Route::apiResource('characteristics', CharacteristicController::class);
Route::get('/characteristics/changeState/{id}', [CharacteristicController::class, 'changeStatusCharacteristic']);
Route::get('/characteristics/searchCharacteristic/{text}', [CharacteristicController::class, 'searchCharacteristic']);


Route::apiResource('characteristicTypes', CharacteristicTypeController::class);
Route::get('/characteristicTypes/changeState/{id}', [CharacteristicTypeController::class, 'changeStatusTypeCharacteristic']);
Route::get('/characteristicTypes/searchTypeCharacteristic/{text}',[CharacteristicTypeController::class,'searchTypeCharacteristic']);


Route::get('/packs/productsNotInPack',[ProductInPackController::class,'productsNotInPack']);
Route::apiResource('packs', ProductInPackController::class);

Route::get('/characteristic-types',[CharacteristicTypeController::class,'getTypes']);


// Rutas para el HomeScreen
Route::apiResource('homescreens', HomeScreenController::class);

Route::post('/contacte', [ContactController::class, 'store']);
