<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use App\Models\OrderDetail;
use App\Models\OrderProduct;



class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Order::with('user', 'products', 'detail')->get();
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

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Order::with('user', 'products', 'detail')->findOrFail($id);

        /*
        if ($order->user_id !== auth()->id() && auth()->user->userType !=='admin') {
            return response()->json(['error' => 'No autoritzat'], 403);
        }
        */
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
        //
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
        $order = Order::where('user_id', $user->id)
            ->where('id', $orderId)
            ->where('status', 'cart')
            ->with('products') // para acceder a los productos y sus precios
            ->first();

        if (!$order) {
            return response()->json(['error' => 'Carrito no encontrado'], 404);
        }

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

        // Crear o actualizar OrderDetail (guardando el precio de instalación)
        $detail = OrderDetail::updateOrCreate(
            ['order_id' => $order->id],
            [
                'shipping_address' => $validated['shipping_address'],
                'requested_delivery_date' => $validated['requested_delivery_date'] ?? null,
                'installation' => $validated['installation'] ?? false,
                'shipping' => $validated['shipping'] ?? false,
                'installation_price' => $validated['installation_price'] ?? false,
                'observations' => $validated['observations']
            ]
        );

        // Actualizar pedido
        $order->status = 'pending';
        $order->observations = $validated['observations'] ?? null;
        $detail->observations = $validated['observations'] ?? null;
        $order->total_price = $validated['total'];
        $order->save();
        $detail->save();

        return response()->json([
            'message' => 'Pedido realizado correctamente',
            'order' => $order->load('detail', 'products'),
        ], 200);
    }

    /**
     * Calcula el precio de instalación según el subtotal de productos instalables.
     * @param float $subtotal
     * @return int|null  Precio en euros o null si >1000€ (a consultar)
     */
    private function calculateInstallationPrice($subtotal)
    {
        if ($subtotal <= 250)
            return 90;
        if ($subtotal <= 500)
            return 120;
        if ($subtotal <= 1000)
            return 180;
        return null; // más de 1000€
    }

}