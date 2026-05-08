<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Characteristic;
use App\Models\ProductImg;
use App\Models\ProductCharacteristic;
use App\Models\CharacteristicType;

class ProductController extends Controller
{
    public function index()
    {
        $characteristics = Characteristic::with('type')->get();
        $categories = Category::all();
        $products = Product::with(['category', 'characteristics', 'primaryImage'])->get();

        return response()->json([
            'characteristics' => $characteristics,
            'categories'      => $categories,
            'products'        => $products
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'code'                 => 'required|string|unique:products,code|max:255',
                'name'                 => 'required|string|max:255',
                'description'          => 'nullable|string',
                'price'                => 'required|numeric|min:0',
                'stock'                => 'required|integer|min:0',
                'discount_percentage'  => 'nullable|integer|min:0|max:100',
                'discount_starts_at'   => 'nullable|date|before_or_equal:discount_ends_at',
                'discount_ends_at'     => 'nullable|date|after_or_equal:discount_starts_at',
                'category_id'          => 'required',
                'product_type'         => 'required|string',
                'int_size'             => 'nullable|string|max:255',
                'ext_size'             => 'nullable|string|max:255',
            ]);

            $validated['highlighted'] = $request->boolean('highlighted');

            $product = Product::create($validated);

            if ($request->has('characteristic')) {
                foreach ($request->characteristic as $char) {
                    $typeId     = $char['type_id'];
                    $value      = $char['value'];
                    $extraValue = $char['extra_value'] ?? null;

                    $type = CharacteristicType::find($typeId);

                    if ($type->type === 'Pes') {
                        ProductCharacteristic::create([
                            'product_id'        => $product->id,
                            'characteristic_id' => null,
                            'value'             => $value
                        ]);
                    } elseif ($type->type === 'Duplicat de clau') {
                        ProductCharacteristic::create([
                            'product_id'        => $product->id,
                            'characteristic_id' => $value,
                            'value'             => $extraValue
                        ]);
                    } else {
                        ProductCharacteristic::create([
                            'product_id'        => $product->id,
                            'characteristic_id' => $value,
                            'value'             => null
                        ]);
                    }
                }
            }

            if ($request->hasFile('images')) {
                $images       = $request->file('images');
                $primaryIndex = $request->input('primary_image_index', 0);

                foreach ($images as $index => $image) {
                    $path = $image->store('products', 'public');
                    ProductImg::create([
                        'product_id' => $product->id,
                        'path'       => $path,
                        'is_primary' => (int)$index === (int)$primaryIndex
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Producte creat correctament'
            ], 201);

        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $product = Product::with(['category', 'characteristics.characteristic.type', 'images', 'primaryImage'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'product' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $product = Product::findOrFail($id);

            $validated = $request->validate([
                'code'                => 'required|string|max:255|unique:products,code,' . $id,
                'name'                => 'required|string|max:255',
                'description'         => 'nullable|string',
                'price'               => 'required|numeric|min:0',
                'stock'               => 'required|integer|min:0',
                'discount_percentage' => 'nullable|integer|min:0|max:100',
                'discount_starts_at'  => 'nullable|date|before_or_equal:discount_ends_at', //la fecha de inicio tiene q ser antes de la de final
                'discount_ends_at'    => 'nullable|date|after_or_equal:discount_starts_at', //la fecha de final, tiene q ser despues que la de inicio
                'category_id'         => 'nullable',
                'product_type'        => 'required|string',
                'int_size'             => 'nullable|string|max:255',
                'ext_size'             => 'nullable|string|max:255',
            ]);

            $validated['highlighted'] = (bool) $request->highlighted;

            if (empty($validated['category_id'])) {
                $validated['category_id'] = null;
            }

            $product->update($validated);

            if ($request->has('characteristics')) {
                foreach ($request->characteristics as $char) {
                    $typeId = $char['type_id'];
                    $value  = $char['value'];

                    $existingChar = ProductCharacteristic::where('product_id', $product->id)
                        ->where('characteristic_id', $typeId)
                        ->first();

                    if ($value === '' || $value === null || $value === false) {
                        if ($existingChar) $existingChar->delete();
                    } else {
                        if ($existingChar) {
                            $existingChar->update(['value' => $value]);
                        } else {
                            ProductCharacteristic::create([
                                'product_id'        => $product->id,
                                'characteristic_id' => $typeId,
                                'value'             => $value
                            ]);
                        }
                    }
                }
            }

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

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('products', 'public');
                    ProductImg::create([
                        'product_id' => $product->id,
                        'path'       => $path,
                        'is_primary' => false
                    ]);
                }
            }

            ProductImg::where('product_id', $product->id)->update(['is_primary' => false]);

            $primaryExistingIndex = $request->input('primary_existing_index');
            $primaryNewIndex      = $request->input('primary_new_index');

            if ($primaryExistingIndex !== null) {
                $existingImages = ProductImg::where('product_id', $product->id)->get();
                if (isset($existingImages[(int)$primaryExistingIndex])) {
                    $existingImages[(int)$primaryExistingIndex]->update(['is_primary' => true]);
                }
            } elseif ($primaryNewIndex !== null && $primaryNewIndex >= 0) {
                $allImages     = ProductImg::where('product_id', $product->id)->orderBy('id')->get();
                $totalExisting = $allImages->count() - ($request->hasFile('images') ? count($request->file('images')) : 0);
                $newImageIndex = $totalExisting + (int)$primaryNewIndex;

                if (isset($allImages[$newImageIndex])) {
                    $allImages[$newImageIndex]->update(['is_primary' => true]);
                }
            }

            $hasPrimary = ProductImg::where('product_id', $product->id)->where('is_primary', true)->exists();
            if (!$hasPrimary) {
                $firstImage = ProductImg::where('product_id', $product->id)->first();
                if ($firstImage) $firstImage->update(['is_primary' => true]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Producte actualitzat correctament'
            ], 200);

        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        //
    }

    public function searchProducts($text)
    {
        $characteristics = Characteristic::with('type')->get();
        $categories      = Category::all();

        try {
            if ($text === "") {
                $products = Product::with(['category', 'characteristics', 'primaryImage'])->get();
            } else {
                $products = Product::select('products.code', 'products.name', 'categories.name')
                    ->join('categories', 'categories.id', '=', 'products.category_id')
                    ->where('products.code', 'LIKE', '%' . $text . '%')
                    ->orWhere('products.name', 'LIKE', '%' . $text . '%')
                    ->orWhere('categories.name', 'LIKE', '%' . $text . '%')
                    ->with(['category', 'characteristics', 'primaryImage'])
                    ->get();
            }

            return response()->json([
                'success'         => true,
                'characteristics' => $characteristics,
                'categories'      => $categories,
                'products'        => $products,
                'message'         => 'Productes passan',
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al buscar el camp',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function getProductCategory($category)
    {
        $category = Category::where('name', $category)->first();
        $products = Product::where('category_id', $category->id)
            ->with(['category', 'characteristics', 'primaryImage'])
            ->get();

        return response()->json([
            'success'  => true,
            'products' => $products,
            'message'  => 'Productes passan',
        ], 201);
    }

    public function getProductLatest()
    {
        $products = Product::latest()
            ->with(['category', 'characteristics', 'primaryImage'])
            ->take(8)
            ->get();

        return response()->json([
            'success'  => true,
            'products' => $products,
            'message'  => 'Productes passan',
        ], 201);
    }

    public function getProductCategoryLatest($category)
    {
        $category = Category::where('name', $category)->first();
        $products = Product::where('category_id', $category->id)
            ->with(['category', 'characteristics', 'primaryImage'])
            ->latest()
            ->take(8)
            ->get();

        return response()->json([
            'success'  => true,
            'products' => $products,
            'message'  => 'Productes passan',
        ], 201);
    }

    public function searchAllProductsInStore(Request $request)
    {
        try {
            $validated = $request->validate([
                'searchText'     => 'nullable|string|max:255',
                'filters'   => 'nullable|present|array',
                'selectFilters'   => 'nullable|present|array',
                'minPrice'  => 'nullable|integer',
                'maxPrice'  => 'nullable|integer',
                'minWeight' => 'nullable|integer',
                'maxWeight' => 'nullable|integer',
            ]);

            $text    = $validated['searchText'];
            $filters = $validated['filters'];
            $minPrice = $validated['minPrice'];
            $maxPrice = $validated['maxPrice'];
            $minWeight = $validated['minWeight'];
            $maxWeight = $validated['maxWeight'];

            $query = Product::with(['category', 'characteristics', 'primaryImage']);

            if (!empty($filters)) {
                foreach ($filters as $filter) {
                    $filterId = (int) $filter;
                    $query->orWhereHas('characteristics', function ($q) use ($filterId) {
                        $q->where('characteristic_id', $filterId);
                    });
                    
                }
            }

            // 1.5. Filtre per preu i pes

            if(!empty($minPrice) || !empty($maxPrice)){

                if (!empty($minPrice)) {
                    $query->where('sale_price', '>=', $minPrice);
                }

                if (!empty($maxPrice)) {
                    $query->where('sale_price', '<=', $maxPrice);
                }

            }
            /*
            if(!empty($minWeight) || !empty($maxWeight)){

                if (!empty($minWeight)) {
                    $query->where('sale_price', '>=', $minWeight);
                }

                if (!empty($maxWeight)) {
                    $query->where('sale_price', '<=', $maxWeight);
                }
                
            }
            */

            // 2. Filtre de caracteristiques de select
            if(!empty($validated['selectFilters'])){
                foreach($validated['selectFilters'] as $value => $id){
                    if (!empty($id)) {
                        $query->whereHas('characteristics', function ($q) use ($id) {
                            $q->where('characteristic_id', $id);
                        });
                    }
                }
            }

            if ($text !== "") {
                $query->where(function ($q) use ($text) {
                    $q->where('name', 'LIKE', "%$text%")
                        ->orWhere('code', 'LIKE', "%$text%");
                });
            }

            $products = $query->get();

            return response()->json([
                'success'  => true,
                'products' => $products,
                'message'  => 'Productes trobats: ' . $products->count(),
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function searchProductsInStore(Request $request)
    {
        try {
            $validated = $request->validate([
                'searchText'     => 'nullable|string|max:255',
                'filters'   => 'nullable|present|array',
                'selectFilters'   => 'nullable|present|array',
                'category'     => 'required|string|max:100',
                'minPrice'  => 'nullable|integer',
                'maxPrice'  => 'nullable|integer',
                'minWeight' => 'nullable|integer',
                'maxWeight' => 'nullable|integer',
            ]);
        
            $category=$validated['category'];
            $text=$validated['searchText'];
            $filters = $validated['filters'];

            $query = Product::with(['category', 'characteristics', 'primaryImage']);

            $query->whereHas('category', function ($q) use ($category) {
                $q->where('name', 'LIKE', $category);
            });

            // 1.5. Filtre per preu i pes

            if(!empty($minPrice) || !empty($maxPrice)){

                if (!empty($minPrice)) {
                    $query->where('sale_price', '>=', $minPrice);
                }

                if (!empty($maxPrice)) {
                    $query->where('sale_price', '<=', $maxPrice);
                }

            }
            /*
            if(!empty($minWeight) || !empty($maxWeight)){

                if (!empty($minWeight)) {
                    $query->where('sale_price', '>=', $minWeight);
                }

                if (!empty($maxWeight)) {
                    $query->where('sale_price', '<=', $maxWeight);
                }
                
            }
            */

            // 1.5. Filtre per preu i pes

            if(!empty($minPrice) || !empty($maxPrice)){

                if (!empty($minPrice)) {
                    $query->where('sale_price', '>=', $minPrice);
                }

                if (!empty($maxPrice)) {
                    $query->where('sale_price', '<=', $maxPrice);
                }

            }
            /*
            if(!empty($minWeight) || !empty($maxWeight)){

                if (!empty($minWeight)) {
                    $query->where('sale_price', '>=', $minWeight);
                }

                if (!empty($maxWeight)) {
                    $query->where('sale_price', '<=', $maxWeight);
                }
                
            }
            */

            if (!empty($filters)) {
                $query->where(function ($q) use ($filters) {
                    foreach ($filters as $filter) {
                        $filterId = (int) $filter;
                        $q->orWhereHas('characteristics', function ($q2) use ($filterId) {
                            $q2->where('characteristic_id', $filterId);
                        });
                    }
                });
            }

            if (!empty($validated['selectFilters'])) {
                foreach ($validated['selectFilters'] as $value => $id) {
                    if (!empty($id)) {
                        $query->whereHas('characteristics', function ($q) use ($id) {
                            $q->where('characteristic_id', $id);
                        });
                    }
                }
            }

            if ($text !== "") {
                $query->where(function ($q) use ($text) {
                    $q->where('name', 'LIKE', "%$text%")
                        ->orWhere('code', 'LIKE', "%$text%");
                });
            }

            $products = $query->get();

            return response()->json([
                'success'  => true,
                'products' => $products,
                'message'  => 'Productes trobats: ' . $products->count(),
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function changeStatusProduct($id)
    {
        try {
            $product = Product::findOrFail($id);
            $product->update(['status' => !$product->status]);

            return response()->json([
                'success' => true,
                'product' => $product,
                'message' => 'Canvi de estat fet'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'error en canviar el estat',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function countProducts()
    {
        try {
            $products = Product::count();

            return response()->json([
                'success'  => true,
                'products' => $products,
                'message'  => 'Passat num de productes'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'error en contar els productes',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}