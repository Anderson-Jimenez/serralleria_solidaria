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

        $products = Product::with(['category','characteristics','primaryImage'])->get();

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
                        //Si el index coincide con el seleccionado en el front, es la principal
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
        //
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
        //
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
}
