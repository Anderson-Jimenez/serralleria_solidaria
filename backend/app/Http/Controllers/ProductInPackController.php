<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Characteristic;
use App\Models\ProductImg;
use App\Models\ProductCharacteristic;
use App\Models\ProductInPack;
use App\Models\CharacteristicType;

class ProductInPackController extends Controller
{
    public function index()
    {
        return Product::where('product_type', 'pack')
            ->with(['category', 'characteristics', 'primaryImage', 'packItems.product'])
            ->get();
    }

    public function create() {}

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'code'                => 'required|string|unique:products,code|max:255',
                'name'                => 'required|string|max:255',
                'description'         => 'nullable|string',
                'product_ids'         => 'required|array|min:1',
                'product_ids.*'       => 'exists:products,id',
                'price'               => 'required|numeric|min:0',
                'stock'               => 'required|integer|min:0',
                'discount_percentage' => 'nullable|integer|min:0|max:100',
                'discount_starts_at'  => 'nullable|date|before_or_equal:discount_ends_at',
                'discount_ends_at'    => 'nullable|date|after_or_equal:discount_starts_at',
                'category_id'         => 'nullable',
                'product_type'        => 'required|string',
            ]);

            $packItemIds = $validated['product_ids'];
            unset($validated['product_ids']);
            
            $validated['highlighted'] = $request->boolean('highlighted');

            if (empty($validated['category_id'])) {
                $validated['category_id'] = null;
            }

            $product = Product::create($validated);

            foreach ($packItemIds as $idProd) {
                ProductInPack::create([
                    'product_pack' => $product->id,
                    'product_id'   => $idProd,
                ]);
            }

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
                            'value'             => $value,
                        ]);
                    } elseif ($type->type === 'Duplicat de clau') {
                        ProductCharacteristic::create([
                            'product_id'        => $product->id,
                            'characteristic_id' => $value,
                            'value'             => $extraValue,
                        ]);
                    } else {
                        ProductCharacteristic::create([
                            'product_id'        => $product->id,
                            'characteristic_id' => $value,
                            'value'             => null,
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
                        'is_primary' => (int) $index === (int) $primaryIndex,
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Pack creat correctament',
            ], 201);

        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $product = Product::with([
                'packItems.product', 'category',
                'characteristics.characteristic.type',
                'images', 'primaryImage'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'product' => $product,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage(),
            ], 404);
        }
    }

    public function edit(string $id) {}

    public function update(Request $request, $id)
    {
        try {
            $product = Product::with('packItems.product')->findOrFail($id);

            $validated = $request->validate([
                'code'                => 'required|string|max:255|unique:products,code,' . $id,
                'name'                => 'required|string|max:255',
                'description'         => 'nullable|string',
                'product_ids'         => 'required|array|min:1',
                'product_ids.*'       => 'exists:products,id',
                'price'               => 'required|numeric|min:0',
                'stock'               => 'required|integer|min:0',
                'discount_percentage' => 'nullable|integer|min:0|max:100',
                'discount_starts_at'  => 'nullable|date|before_or_equal:discount_ends_at',
                'discount_ends_at'    => 'nullable|date|after_or_equal:discount_starts_at',
                'category_id'         => 'nullable',
                'product_type'        => 'required|string',
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
                        'is_primary' => false,
                    ]);
                }
            }

            ProductImg::where('product_id', $product->id)->update(['is_primary' => false]);

            $primaryExistingIndex = $request->input('primary_existing_index');
            $primaryNewIndex      = $request->input('primary_new_index');

            if ($primaryExistingIndex !== null) {
                $existingImages = ProductImg::where('product_id', $product->id)->get();
                if (isset($existingImages[(int) $primaryExistingIndex])) {
                    $existingImages[(int) $primaryExistingIndex]->update(['is_primary' => true]);
                }
            } elseif ($primaryNewIndex !== null && $primaryNewIndex >= 0) {
                $allImages     = ProductImg::where('product_id', $product->id)->orderBy('id')->get();
                $totalExisting = $allImages->count() - ($request->hasFile('images') ? count($request->file('images')) : 0);
                $newImageIndex = $totalExisting + (int) $primaryNewIndex;

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
                'message' => 'Pack actualitzat correctament',
            ], 200);

        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id) {}

    public function productsNotInPack()
    {
        return Product::where('product_type', 'simple')->get();
    }
}