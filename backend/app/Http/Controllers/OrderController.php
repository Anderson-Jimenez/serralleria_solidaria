<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use App\Models\OrderDetail;
use App\Models\Product;
use App\Models\OrderProduct;
use Illuminate\Support\Facades\DB;



class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Order::with('user', 'products', 'detail')->where('status', '!=', 'cart')->get();
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
        //
    }

    public function show(string $id)
    {
        $order = Order::with(['user', 'products', 'detail'])->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Order::with('user', 'products', 'detail')->findOrFail($id)->get();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order = Order::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:cart,pending,paid,processing,shipped,completed,cancelled'
        ]);
        $order->status = $validated['status'];
        $order->save();
        return response()->json(['success' => true, 'order' => $order]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function checkout(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $orderId = $request->input('order_id');

        $validated = $request->validate([
            'shipping_address' => 'required|string',
            'requested_delivery_date' => 'nullable|date',
            'installation' => 'boolean',
            'installation_price' => 'nullable|numeric',
            'shipping' => 'boolean',
            'shipping_price' => 'nullable|numeric',
            'observations' => 'nullable|string',
            'total' => 'required|numeric',
        ]);

        try {
            DB::transaction(function () use ($user, $orderId, $validated, $request) {
                $order = Order::where('id', $orderId)
                            ->where('status', 'cart')
                            ->lockForUpdate()
                            ->first();

                if (!$order) {
                    throw new \Exception('Carrito no encontrado');
                }

                if (is_null($order->user_id)) {
                    $order->user_id = $user->id;
                    $order->save();
                } elseif ($order->user_id !== $user->id) {
                    throw new \Exception('Este carrito no te pertenece');
                }

                foreach ($order->products as $orderProduct) {
                    $product = Product::lockForUpdate()->find($orderProduct->id);
                    if (!$product) throw new \Exception("Producto {$orderProduct->id} no encontrado");
                    $newStock = $product->stock - $orderProduct->pivot->quantity;
                    if ($newStock < 0) throw new \Exception("Stock insuficiente para {$product->name}");
                    $product->stock = $newStock;
                    $product->save();
                }

                $detail = OrderDetail::updateOrCreate(
                    ['order_id' => $order->id],
                    [
                        'shipping_address' => $validated['shipping_address'],
                        'requested_delivery_date' => $validated['requested_delivery_date'] ?? null,
                        'installation' => $validated['installation'] ?? false,
                        'shipping' => $validated['shipping'] ?? false,
                        'installation_price' => $validated['installation_price'] ?? 0,
                        'observations' => $validated['observations'] ?? null,
                    ]
                );

                $order->status = 'pending';
                $order->observations = $validated['observations'] ?? null;
                $order->total_price = $validated['total'];
                $order->save();
                $detail->save();

                $newCart = Order::create([
                    'user_id' => $user->id,
                    'status' => 'cart',
                    'total_price' => 0,
                ]);

                $request->merge(['new_cart_id' => $newCart->id]);
            });

            return response()->json([
                'message' => 'Pedido realizado correctamente',
                'new_cart_id' => $request->input('new_cart_id'),
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
    public function userOrders(Request $request)
    {
        $user = $request->user();
        $orders = Order::with('products')  // o 'products' con los datos de producto
                    ->where('user_id', $user->id)
                    ->where('status', '!=', 'cart')  // excluir carrito activo
                    ->orderBy('created_at', 'desc')
                    ->paginate(10); // paginación para no cargar todo

        return response()->json($orders);
    }
    public function showOrderDetails($id, Request $request)
    {
        $user = $request->user();
        $order = Order::with(['products', 'detail'])  // detail es la tabla order_details
                    ->where('user_id', $user->id)
                    ->where('id', $id)
                    ->where('status', '!=', 'cart')
                    ->firstOrFail();

        return response()->json($order);
    }

}