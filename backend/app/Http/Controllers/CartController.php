<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Characteristic;
use App\Models\ProductImg;
use App\Models\ProductCharacteristic;
use App\Models\CharacteristicType;
use App\Models\OrderProduct;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use App\Models\Product;

class CartController extends Controller
{
    public function index()
    {
            $cartItems = OrderProduct::with('product')
                ->whereHas('order', function ($query) {
                    $query->where('status', 'cart');
                })
                ->get();
    
            return response()->json($cartItems, 200);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'order_id'   => 'nullable|integer|exists:orders,id',
        ]);

        $itemResponse = null;

        try {
            $userId = auth()->id();

            if ($request->order_id) {
                $order = Order::findOrFail($request->order_id);
            } else {
                $order = Order::create([
                    'user_id'     => $userId,
                    'status'      => 'cart',
                    'total_price' => 0,
                ]);
            }

            DB::transaction(function () use ($request, &$order, &$itemResponse) {

                $product = Product::lockForUpdate()->findOrFail($request->product_id);

                $price = $product->price;

                if (
                    $product->discount_percentage &&
                    (! $product->discount_starts_at || $product->discount_starts_at <= now()) &&
                    (! $product->discount_ends_at || $product->discount_ends_at >= now())
                ) {
                    $price = $product->price - ($product->price * $product->discount_percentage / 100);
                }

                $lineaExistente = OrderProduct::where('order_id', $order->id)
                    ->where('product_id', $product->id)
                    ->first();

                $cantidadTotal = $request->quantity;

                if ($lineaExistente) {
                    $cantidadTotal += $lineaExistente->quantity;
                }

                if ($cantidadTotal > $product->stock) {
                    throw new \Exception('No hay suficiente stock');
                }

                if ($lineaExistente) {
                    $lineaExistente->update([
                        'quantity'   => $cantidadTotal,
                        'unit_price' => $price,
                        'subtotal'   => $price * $cantidadTotal,
                    ]);

                    $itemResponse = $lineaExistente;
                } else {
                    $itemResponse = OrderProduct::create([
                        'order_id'   => $order->id,
                        'product_id' => $product->id,
                        'quantity'   => $request->quantity,
                        'unit_price' => $price,
                        'subtotal'   => $price * $request->quantity,
                    ]);
                }

                $order->update([
                    'total_price' => $order->products()->sum('subtotal'),
                ]);
            });

            $item = OrderProduct::with('product.primaryImage')
                ->find($itemResponse->id);

            return response()->json([
                'message'  => 'Producto añadido al carrito',
                'order_id' => $order->id,
                'item'     => $item,
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Cart error: ' . $e->getMessage());

            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function show(string $id){
        $items = OrderProduct::with('product.primaryImage')->where('order_id', $id)->get()
            ->map(function ($item) {

                $product = $item->product;

                $price = $product->price;

                if (
                    $product->discount_percentage &&
                    (! $product->discount_starts_at || $product->discount_starts_at <= now()) &&
                    (! $product->discount_ends_at || $product->discount_ends_at >= now())
                ) {
                    $price = $product->price - ($product->price * $product->discount_percentage / 100);
                }

                $item->unit_price = $price;
                $item->subtotal = $price * $item->quantity;

                return $item;
            });

        return response()->json($items, 200);
    }
 


    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $item = OrderProduct::with('product')->findOrFail($id);

        $product = $item->product;

        $price = $product->price;

        if (
            $product->discount_percentage &&
            (! $product->discount_starts_at || $product->discount_starts_at <= now()) &&
            (! $product->discount_ends_at || $product->discount_ends_at >= now())
        ) {
            $price = $product->price - ($product->price * $product->discount_percentage / 100);
        }

        // VALIDAR STOCK
        if ($request->quantity > $product->stock) {
            return response()->json([
                'error' => 'No hay suficiente stock'
            ], 400);
        }

        $item->update([
            'quantity'   => $request->quantity,
            'unit_price' => $price,
            'subtotal'   => $price * $request->quantity,
        ]);

        $item->order->update([
            'total_price' => $item->order->products()->sum('subtotal'),
        ]);

        $updatedItem = OrderProduct::with('product.primaryImage')
            ->find($item->id);

        return response()->json([
            'item' => $updatedItem
        ], 200);
    }
    public function updateTotal(Request $request, string $id)
    {
        $request->validate([
            'total_price' => 'required|numeric|min:0',
        ]);

        $order = Order::findOrFail($id);

        $order->update([
            'total_price' => $request->total_price,
        ]);

        return response()->json([
            'message' => 'Total actualitzat',
            'order' => $order,
        ]);
    }
}