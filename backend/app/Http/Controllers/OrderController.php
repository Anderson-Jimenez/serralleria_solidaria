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
        return Order::with('user')->get();
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
        return Order::with('user')->findOrFail($id);

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
        return Order::with('user')->findOrFail($id)->get();
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
    public function checkout(Request $request){
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $orderId = $request->input('order_id');
        $order = Order::where('user_id', $user->id)
            ->where('id', $orderId)
            ->where('status', 'cart')
            ->with('products.product') // para acceder a los productos y sus precios
            ->first();

        if (!$order) {
            return response()->json(['error' => 'Carrito no encontrado'], 404);
        }

        $validated = $request->validate([
            'shipping_address'        => 'required|string',
            'billing_address'         => 'required|string',
            'requested_delivery_date' => 'nullable|date',
            'installation'            => 'boolean',
            'installation_address'    => 'nullable|string|required_if:installation,true',
            'observations'            => 'nullable|string',
        ]);

        // Calcular subtotal de productos (todos asumimos instalables)
        $subtotalProductos = $order->products->sum('subtotal');

        // Calcular precio de instalación si se solicita
        $installationPrice = null;
        if ($validated['installation']) {
            $installationPrice = $this->calculateInstallationPrice($subtotalProductos);
            // Si es null significa >1000€ → error
            if ($installationPrice === null) {
                return response()->json([
                    'error' => 'Per a pressupostos superiors a 1.000€, si us plau contacta amb nosaltres.',
                ], 400);
            }
        }

        // Crear o actualizar OrderDetail (guardando el precio de instalación)
        $detail = OrderDetail::updateOrCreate(
            ['order_id' => $order->id],
            [
                'shipping_address'        => $validated['shipping_address'],
                'billing_address'         => $validated['billing_address'],
                'requested_delivery_date' => $validated['requested_delivery_date'] ?? null,
                'installation'            => $validated['installation'] ?? false,
                'installation_address'    => $validated['installation_address'] ?? null,
                'installation_price'      => $installationPrice, // ← guardamos el coste
            ]
        );

        // Calcular total final: productos + instalación + (gastos de envío si los hay)
        $totalFinal = $subtotalProductos;
        if ($installationPrice) {
            $totalFinal += $installationPrice;
        }
        // Si tienes gastos de envío fijos o variables, añádelos aquí, ej:
        // $totalFinal += 9; // coste de envío

        // Actualizar pedido
        $order->status = 'pending';
        $order->observations = $validated['observations'] ?? null;
        $order->total_price = $totalFinal;
        $order->save();

        return response()->json([
            'message' => 'Pedido realizado correctamente',
            'order'   => $order->load('detail', 'products.product'),
        ], 200);
    }

    /**
     * Calcula el precio de instalación según el subtotal de productos instalables.
     * @param float $subtotal
     * @return int|null  Precio en euros o null si >1000€ (a consultar)
     */
    private function calculateInstallationPrice($subtotal)
    {
        if ($subtotal <= 250) return 90;
        if ($subtotal <= 500) return 120;
        if ($subtotal <= 1000) return 180;
        return null; // más de 1000€
    }

}
