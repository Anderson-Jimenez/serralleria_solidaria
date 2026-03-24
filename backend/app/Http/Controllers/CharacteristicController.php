<?php

namespace App\Http\Controllers;
use App\Models\Characteristic;
use App\Models\CharacteristicType;
use Illuminate\Http\Request;


class CharacteristicController extends Controller
{

    public function index()
    {   
        $characteristics = Characteristic::with('type')->get();

        return response()->json([
            'characteristics' => $characteristics,
        ]);
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
                'description' => 'nullable|string',
                'characteristic_type_id' => 'required|exists:characteristic_types,id',
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

    public function changeStatusCharacteristic($id)
    {
        try {
            $characteristic = Characteristic::findOrFail($id); 
            $characteristic->status = ($characteristic->status == 1) ? 0 : 1;
            $characteristic->save();
            
            $characteristic->load('type'); 

            return response()->json([
                'success' => true,
                'characteristic' => $characteristic,
                'message' => 'Canvi de estat fet'
            ], 200);
        
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function searchCharacteristic($text)
    {
        try {
            if($text===""){
                $characteristics = Characteristic::with('type')->get();
            }
            else{
                //$characteristics = Characteristic::with('type')->join('characteristic_types', 'characteristic_types.id', '=', 'characteristic_types_id')->where('id','LIKE',$text)->orWhere('description','LIKE','%'.$text.'%')->orWhere('characteristic_types.type','LIKE','%'.$text.'%')->get(); 
                
                $characteristics = Characteristic::select('characteristics.id','characteristics.description','characteristics.characteristic_type_id')
                    ->join('characteristic_types', 'characteristic_types.id', '=', 'characteristics.characteristic_type_id')
                    ->where('characteristics.id', 'LIKE','%' . $text . '%')
                    ->orWhere('characteristics.description', 'LIKE', '%' . $text . '%')
                    ->orWhere('characteristic_types.type', 'LIKE', '%' . $text . '%')
                    ->with('type')
                    ->get();
            }
            
            return response()->json([
                'success' => true,
                'characteristics' => $characteristics,
                'message' => 'Caracteristicas passan'
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
