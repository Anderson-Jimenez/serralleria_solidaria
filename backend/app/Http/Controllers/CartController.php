<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Product;

class CartController extends Controller
{
    // Obtener items del carrito activo del usuario autenticado
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([]);
        }

        $order = Order::where('user_id', $user->id)
                      ->where('status', 'cart')
                      ->first();

        if (!$order) {
            return response()->json([]);
        }

        $cartItems = OrderProduct::with('product')
                    ->where('order_id', $order->id)
                    ->get();

        return response()->json($cartItems, 200);
    }

    // Añadir producto al carrito (funciona tanto para autenticados como invitados)
    public function store(Request $request)
    {
        $user = Auth::user();
        $userId = $user ? $user->id : null;

        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'order_id'   => 'nullable|integer|exists:orders,id',
        ]);

        $order = null;

        try {
            // 1. Si viene order_id y ese pedido está en estado 'cart', lo usamos
            if ($request->order_id) {
                $order = Order::where('id', $request->order_id)
                              ->where('status', 'cart')
                              ->first();
            }

            // 2. Si no, buscamos un carrito activo para el usuario (si está logueado)
            if (!$order && $userId) {
                $order = Order::where('user_id', $userId)
                              ->where('status', 'cart')
                              ->first();
            }

            // 3. Si no hay, creamos uno nuevo
            if (!$order) {
                $order = Order::create([
                    'user_id'     => $userId,
                    'status'      => 'cart',
                    'total_price' => 0,
                ]);
            }

            $itemResponse = null;

            DB::transaction(function () use ($request, $order, &$itemResponse) {
                $product = Product::lockForUpdate()->findOrFail($request->product_id);
                $price = $product->price;

                // Aplicar descuento si corresponde
                if ($product->discount_percentage &&
                    (!$product->discount_starts_at || $product->discount_starts_at <= now()) &&
                    (!$product->discount_ends_at || $product->discount_ends_at >= now())) {
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

                // Actualizar total del pedido
                $order->update([
                    'total_price' => $order->products()->sum('subtotal'),
                ]);
            });

            $item = OrderProduct::with('product.primaryImage')->find($itemResponse->id);

            return response()->json([
                'message'  => 'Producto añadido al carrito',
                'order_id' => $order->id,
                'item'     => $item,
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Cart error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    // Mostrar items de un pedido concreto (usado por el frontend)
    public function show(string $id)
    {
        $items = OrderProduct::with('product.primaryImage')
                 ->where('order_id', $id)
                 ->get()
                 ->map(function ($item) {
                     $product = $item->product;
                     $price = $product->price;

                     if ($product->discount_percentage &&
                         (!$product->discount_starts_at || $product->discount_starts_at <= now()) &&
                         (!$product->discount_ends_at || $product->discount_ends_at >= now())) {
                         $price = $product->price - ($product->price * $product->discount_percentage / 100);
                     }

                     $item->unit_price = $price;
                     $item->subtotal = $price * $item->quantity;
                     return $item;
                 });

        return response()->json($items, 200);
    }

    // Actualizar cantidad de un producto en el carrito
    public function update(Request $request, string $id)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        $item = OrderProduct::with('product')->findOrFail($id);
        $product = $item->product;
        $price = $product->price;

        if ($product->discount_percentage &&
            (!$product->discount_starts_at || $product->discount_starts_at <= now()) &&
            (!$product->discount_ends_at || $product->discount_ends_at >= now())) {
            $price = $product->price - ($product->price * $product->discount_percentage / 100);
        }

        if ($request->quantity > $product->stock) {
            return response()->json(['error' => 'No hay suficiente stock'], 400);
        }

        $item->update([
            'quantity'   => $request->quantity,
            'unit_price' => $price,
            'subtotal'   => $price * $request->quantity,
        ]);

        $item->order->update([
            'total_price' => $item->order->products()->sum('subtotal'),
        ]);

        $updatedItem = OrderProduct::with('product.primaryImage')->find($item->id);

        return response()->json(['item' => $updatedItem], 200);
    }

    // Eliminar un producto del carrito
    public function destroy(string $id)
    {
        $item = OrderProduct::findOrFail($id);
        $order = $item->order;
        $item->delete();

        $order->update([
            'total_price' => $order->products()->sum('subtotal'),
        ]);

        return response()->json(['message' => 'Producto eliminado del carrito'], 200);
    }

    // Actualizar el total de un pedido (si es necesario)
    public function updateTotal(Request $request, string $id)
    {
        $request->validate(['total_price' => 'required|numeric|min:0']);
        $order = Order::findOrFail($id);
        $order->update(['total_price' => $request->total_price]);
        return response()->json(['message' => 'Total actualizado', 'order' => $order]);
    }
}