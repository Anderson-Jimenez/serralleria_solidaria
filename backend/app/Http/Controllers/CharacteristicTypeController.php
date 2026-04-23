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
        return CharacteristicType::with(['characteristics' => function($query) {
            $query->where('status', 1);
        }])->where('status', 1)->get();
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
                'filterType' => 'required|string|max:255',
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

    public function changeStatusTypeCharacteristic($id)
    {
        try {
            $type = CharacteristicType::findOrFail($id); 
            if ($type->status == 1 ){
                $type->update(['status' => 0]);
            }
            else{
                $type->update(['status' => 1]);
            }
            
            return response()->json([
                'success' => true,
                'type' => $type,
                'message' => 'Canvi de estat fet'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'error en canviar el estat',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function searchTypeCharacteristic($text)
    {
        try {
            if($text===""){
                $types = CharacteristicType::all(); 
            }
            else{
                $types = CharacteristicType::where('id','LIKE','%' . $text . '%')->orWhere('type','LIKE','%'.$text.'%')->get(); 
            }
            
            return response()->json([
                'success' => true,
                'types' => $types,
                'message' => 'Tipus de caracteristicas passan'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al buscar el camp',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
