<?php

use App\Http\Controllers\CharacteristicController;
use App\Http\Controllers\CharacteristicTypeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductInPackController;
use App\Http\Controllers\HomeScreenController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
Use App\Http\Controllers\CartController;

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
Route::post('/products/searchAllProductsInStore', [ProductController::class, 'searchAllProductsInStore']);
Route::get('/productes/getProductLatest', [ProductController::class, 'getProductLatest']);

Route::get('/products/changeState/{id}', [ProductController::class, 'changeStatusProduct']);
Route::get('/products/getProductCategory/{category}', [ProductController::class, 'getProductCategory']);
Route::get('/products/getProductCategoryLatest/{category}', [ProductController::class, 'getProductCategoryLatest']);
Route::get('/productes/countProducts', [ProductController::class, 'countProducts']);

Route::apiResource('cart', CartController::class);





Route::apiResource('characteristics', CharacteristicController::class);
Route::get('/characteristics/changeState/{id}', [CharacteristicController::class, 'changeStatusCharacteristic']);
Route::get('/characteristics/searchCharacteristic/{text}', [CharacteristicController::class, 'searchCharacteristic']);


Route::apiResource('characteristic-types', CharacteristicTypeController::class);
Route::get('/characteristicTypes/changeState/{id}', [CharacteristicTypeController::class, 'changeStatusTypeCharacteristic']);
Route::get('/characteristicTypes/searchTypeCharacteristic/{text}',[CharacteristicTypeController::class,'searchTypeCharacteristic']);


Route::apiResource('packs', ProductInPackController::class);
Route::get('/packs/productsNotInPack',[ProductInPackController::class,'productsNotInPack']);

// Rutes per a users
Route::apiResource('users', UserController::class);

// Rutas para el HomeScreen
Route::apiResource('homescreens', HomeScreenController::class);

//Solucions personalitzades
Route::apiResource('contact', ContactController::class);
Route::get('/solucionsPersonalitzades', [ContactController::class, 'getCustomSolutions']);

Route::get('/peticions/{id}', [ContactController::class, 'showEspecificPetition']);
Route::put('/peticions/{id}', [ContactController::class, 'updatePetitionStatus']);


//Log In

Route::post('/login', [AuthController::class, 'login']);
Route::post('/signin', [AuthController::class, 'signin']);


// Rutas protegidas — solo con token válido
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Rutas solo para admin
    Route::middleware('can:admin')->group(function () {
        // Route::get('/admin/...', [...]);
    });
});