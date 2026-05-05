<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Characteristic;
use App\Models\ProductImg;
use App\Models\ProductCharacteristic;
use App\Models\ProductInPack;


class ProductInPackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Product::where('product_type', 'pack')->with('category')->get();
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
                'code' => 'required|string|unique:products,code|max:255',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',

                'product_ids' => 'required|array|min:1',
                'product_ids.*' => 'exists:products,id',

                'sale_price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'discount' => 'nullable|integer|min:0|max:100',
                'category_id' => 'nullable',
                'product_type' => 'required|string'
            ]);
            
            //Interesa aquest
            $packItemIds = $validated['product_ids'];

            $validated['highlighted'] = (bool) $request->highlighted;

            //Provisional, s'ha de fer categoria especifica per a packs
            if (empty($validated['category_id'])) {
                $validated['category_id'] = null;
            }

            $product = Product::create($validated);

            foreach($packItemIds as $idProd){
                ProductInPack::create([
                    'product_pack' => $product->id,
                    'product_id'=> $idProd,
                ]);
            }

            if ($request->has('characteristics')) {
                foreach ($request->characteristics as $char) {
                    ProductCharacteristic::create([
                        'product_id' => $product->id,
                        'characteristic_id' => $char['type_id'],
                        'value' => $char['value']
                    ]);
                }
            }

            if ($request->hasFile('images')) {
                $images = $request->file('images');
                $primaryIndex = $request->input('primary_image_index', 0);

                foreach ($images as $index => $image) {
                    $path = $image->store('products', 'public');

                    ProductImg::create([
                        'product_id' => $product->id,
                        'path' => $path,
                        //Si el index coincide con el seleccionado en el front, es la principal
                        'is_primary' => (int) $index === (int) $primaryIndex
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Producte creat correctament'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $product = Product::with(['pack.product','category', 'characteristics.characteristic.type', 'images', 'primaryImage'])->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'product' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 404);
        }

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
        try {
            $product = Product::with('pack.product')->findOrFail($id);
            
            $validated = $request->validate([
                'code' => 'required|string|unique:products,code,' . $id . '|max:255',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',

                'product_ids' => 'required|array|min:1',
                'product_ids.*' => 'exists:products,id',

                'sale_price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'discount' => 'nullable|integer|min:0|max:100',
                'category_id' => 'nullable',
                'product_type' => 'required|string'
            ]);

            $packItemIds = $validated['product_ids'];
            unset($validated['product_ids']);

            $validated['highlighted'] = (bool) $request->highlighted;
            
            if (empty($validated['category_id'])) {
                $validated['category_id'] = null;
            }
            
            $product->update($validated);
            
            ProductInPack::where('product_pack', $id)->delete();
            foreach ($packItemIds as $idProd) {
                ProductInPack::create([
                    'product_pack' => $product->id,
                    'product_id'   => $idProd,
                ]);
            }
            
            // Controlar las imagenes existentes
            if ($request->has('existing_images')) {
                $existingImageIds = json_decode($request->existing_images, true);
                
                $imagesToDelete = ProductImg::where('product_id', $product->id)
                    ->whereNotIn('id', $existingImageIds)
                    ->get();
                    
                foreach ($imagesToDelete as $image) {
                    \Storage::disk('public')->delete($image->path);
                    $image->delete();
                }
            }
            
            // Subir imagenes nuevas
            if ($request->hasFile('images')) {
                $images = $request->file('images');
                
                foreach ($images as $image) {
                    $path = $image->store('products', 'public');
                    ProductImg::create([
                        'product_id' => $product->id,
                        'path'       => $path,
                        'is_primary' => false
                    ]);
                }
            }
            
            // Establecer imagen principal
            ProductImg::where('product_id', $product->id)->update(['is_primary' => false]);
            
            $primaryExistingIndex = $request->input('primary_existing_index');
            $primaryNewIndex = $request->input('primary_new_index');
            
            if ($primaryExistingIndex !== null) {
                // La principal es una imagen existente
                $existingImages = ProductImg::where('product_id', $product->id)->get();
                if (isset($existingImages[(int)$primaryExistingIndex])) {
                    $existingImages[(int)$primaryExistingIndex]->update(['is_primary' => true]);
                }
            } elseif ($primaryNewIndex !== null && $primaryNewIndex >= 0) {
                // La principal es una nueva imagen
                $allImages = ProductImg::where('product_id', $product->id)
                    ->orderBy('id', 'asc')
                    ->get();
                
                // Las nuevas imágenes están al final
                $totalExisting = ProductImg::where('product_id', $product->id)->count() - ($request->hasFile('images') ? count($request->file('images')) : 0);
                $newImageIndex = $totalExisting + (int)$primaryNewIndex;
                
                if (isset($allImages[$newImageIndex])) {
                    $allImages[$newImageIndex]->update(['is_primary' => true]);
                }
            }
            
            // Si no hay imagen principal, poner la primera como principal
            $hasPrimary = ProductImg::where('product_id', $product->id)->where('is_primary', true)->exists();
            if (!$hasPrimary) {
                $firstImage = ProductImg::where('product_id', $product->id)->first();
                if ($firstImage) {
                    $firstImage->update(['is_primary' => true]);
                }
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Producte actualitzat correctament'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }

    public function productsNotInPack()
    {
        return Product::where('product_type', 'simple')->get();
    }
}
