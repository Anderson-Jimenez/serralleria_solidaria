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
        $products = Product::with('category', 'characteristics')->get();
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
                'sale_price'          => 'required|numeric|min:0',
                'stock'          => 'required|integer|min:0',
                'discount'       => 'nullable|integer|min:0|max:100',
                'highlighted'    => 'boolean',
                'category_id'    => 'nullable|exists:categories,id',
                'product_type'   => 'required|string'
            ]);

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
}
