<?php

namespace App\Http\Controllers;
use App\Models\Characteristic;
use Illuminate\Http\Request;

class CharacteristicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Characteristic::all();
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
                'description' => 'nullable|string',
            ]);

            $characteristic = Characteristic::create($validated);
            
            return response()->json([
                'success' => true,
                'data' => $characteristic,
                'message' => 'Caracteristica creada correctament'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'error en crear la categoria',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Characteristic::findOrFail($id);

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
    public function update(Request $request, $id)
    {
        $characteristic = Characteristic::findOrFail($id); 

        $characteristic->update($request->all());

        return $characteristic;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $characteristic = Characteristic::findOrFail($id);
        $characteristic->delete();
    }
}
