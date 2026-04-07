<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Characteristic;
use App\Models\ProductImg;
use App\Models\ProductCharacteristic;
class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $characteristics = Characteristic::with('type')->get();
        $categories = Category::all();

        $products = Product::where('product_type', 'simple')->with(['category','characteristics','primaryImage'])->get();

        return response()->json([
            'characteristics' => $characteristics,
            'categories' => $categories,
            'products' => $products
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
                'code'           => 'required|string|unique:products,code|max:255',
                'name'           => 'required|string|max:255',
                'description'    => 'nullable|string',
                'sale_price'     => 'required|numeric|min:0',
                'stock'          => 'required|integer|min:0',
                'discount'       => 'nullable|integer|min:0|max:100',
                'category_id'    => 'nullable',
                'product_type'   => 'required|string'
            ]);
            $validated['highlighted'] = (bool) $request->highlighted;
            if (empty($validated['category_id'])) {
                $validated['category_id'] = null;
            }
            $product = Product::create($validated);

            if ($request->has('characteristics')) {
                foreach ($request->characteristics as $char) {
                    ProductCharacteristic::create([
                        'product_id'        => $product->id,
                        'characteristic_id' => $char['type_id'],
                        'value'             => $char['value']
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
                        'path'       => $path,
                        //Para comparar el index de la imagen con el q en el front, se pone como el "principal"
                        'is_primary' => (int)$index === (int)$primaryIndex
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
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $product = Product::with(['category', 'characteristics', 'images'])->findOrFail($id);
            
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $product = Product::findOrFail($id);
            
            $validated = $request->validate([
                'code'           => 'required|string|max:255|unique:products,code,' . $id,
                'name'           => 'required|string|max:255',
                'description'    => 'nullable|string',
                'sale_price'     => 'required|numeric|min:0',
                'stock'          => 'required|integer|min:0',
                'discount'       => 'nullable|integer|min:0|max:100',
                'category_id'    => 'nullable',
                'product_type'   => 'required|string'
            ]);
            
            $validated['highlighted'] = (bool) $request->highlighted;
            
            if (empty($validated['category_id'])) {
                $validated['category_id'] = null;
            }
            
            $product->update($validated);
            
            // Actualizar características - MODIFICAR, no eliminar todas
            if ($request->has('characteristics')) {
                foreach ($request->characteristics as $char) {
                    $typeId = $char['type_id'];
                    $value = $char['value'];
                    
                    // Buscar si ya existe esta característica para el producto
                    $existingChar = ProductCharacteristic::where('product_id', $product->id)
                        ->where('characteristic_id', $typeId)
                        ->first();
                    
                    if ($value === '' || $value === null || $value === false) {
                        // Si el valor está vacío, eliminar la característica si existe
                        if ($existingChar) {
                            $existingChar->delete();
                        }
                    } else {
                        // Si hay valor, actualizar o crear
                        if ($existingChar) {
                            $existingChar->update(['value' => $value]);
                        } else {
                            ProductCharacteristic::create([
                                'product_id' => $product->id,
                                'characteristic_id' => $typeId,
                                'value' => $value
                            ]);
                        }
                    }
                }
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
    public function destroy(string $id)
    {
        //
    }

    public function searchProducts($text)
    {
        $characteristics = Characteristic::with('type')->get();
        $categories = Category::all();

        try {
            if($text===""){
                $products = Product::with(['category','characteristics','primaryImage'])->get();
            }
            else{
                
                $products = Product::select('products.code','products.name','categories.name')
                    ->join('categories', 'categories.id', '=', 'products.category_id')
                    ->where('products.code', 'LIKE','%' . $text . '%')
                    ->orWhere('products.name', 'LIKE', '%' . $text . '%')
                    ->orWhere('categories.name', 'LIKE', '%' . $text . '%')
                    ->with(['category','characteristics','primaryImage'])
                    ->get();
            }


            return response()->json([
                'success' => true,
                'characteristics' => $characteristics,
                'categories' => $categories,
                'products' => $products,
                'message' => 'Productes passan',
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al buscar el camp',
                'error' => $e->getMessage()
            ], 500);
        }
    }




    public function getProductCategory($category){
        $category = Category::where('name', $category)->first();
        
        $products = Product::where('category_id',$category->id)->get();

        return response()->json([
            'success' => true,
            'products' => $products,
            'message' => 'Productes passan',
        ], 201);
    }

    public function getProductCategoryLatest($category){
        $category = Category::where('name', $category)->first();
        
        $products = Product::where('category_id',$category->id)->latest()->take(8)->get();

        return response()->json([
            'success' => true,
            'products' => $products,
            'message' => 'Productes passan',
        ], 201);
    }

    public function searchProductsInStore(Request $request)
    {
        try {
            $validated = $request->validate([
                'searchText'     => 'nullable|string|max:255',
                'filters'   => 'present|array',
                'category'     => 'required|string|max:100',
            ]);

            $category=$validated['category'];
            $text=$validated['searchText'];
            $filters = collect($validated['filters'])->flatten()->all();

            $query = Product::with(['category', 'characteristics', 'primaryImage']);

            // 1. Filtre de categoria (Això SEMPRE s'ha d'aplicar)
            $query->whereHas('category', function($q) use ($category) {
                $q->where('name', 'LIKE', $category); 
            });

            if (!empty($filters) && count($filters) > 0) {
                $query->whereHas('characteristics', function($q) use ($filters) {
                    $q->whereIn('characteristics.id', $filters);
                });
            }

            /*
            foreach($filters as $filter){
                $filterId = (int) $filter;
                $query->whereHas('characteristics', function($q) use ($filterId) {
                    $q->whereIn('characteristics.id', $filterId); 
                });
            }
            */

            // 2. Filtre de text (AGRUPAT)
            if ($text !== "") {
                // Fem servir un where amb funció per agrupar els OR
                $query->where(function($q) use ($text) {
                    $q->where('name', 'LIKE', "%$text%")
                    ->orWhere('code', 'LIKE', "%$text%");
                });
            }

            $products = $query->get();

            return response()->json([
                'success' => true,
                'products' => $products,
                'message' => 'Productes trobats: ' . $products->count(),
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
