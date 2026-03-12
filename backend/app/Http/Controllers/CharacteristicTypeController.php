<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CharacteristicType;

class CharacteristicTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CharacteristicType::all();
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
        try {
            $validated = $request->validate([
                'type' => 'required|string|max:255',
            ]);

            $characteristicType = CharacteristicType::create($validated);
            
            return response()->json([
                'success' => true,
                'data' => $characteristicType,
                'message' => 'Tipus de Caracteristica creada correctament'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'error en crear el tipus',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return CharacteristicType::findOrFail($id);
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
        $characteristicType = CharacteristicType::findOrFail($id); 

        $characteristicType->update($request->all());

        return $characteristicType;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $characteristic = CharacteristicType::findOrFail($id);
        $characteristic->delete();
    }
}
