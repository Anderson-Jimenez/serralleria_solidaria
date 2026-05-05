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
        try {
            $request->validate([
                'product_id' => 'required|integer|exists:products,id',
                'quantity'   => 'required|integer|min:1',
                'unit_price' => 'required|numeric|min:0',
                'order_id'   => 'nullable|integer|exists:orders,id', // opcional, viene del frontend
            ]);
            $userId = auth()->id();

            if ($request->order_id) {
                $order = Order::find($request->order_id);
            } else {
                $order = Order::create([
                    'user_id'     => $userId,
                    'status'      => 'cart',
                    'total_price' => 0,
                ]);
            }

            $subtotal = $request->unit_price * $request->quantity;

            $lineaExistente = OrderProduct::where('order_id', $order->id)
                ->where('product_id', $request->product_id)
                ->first();

            if ($lineaExistente) {
                $lineaExistente->update([
                    'quantity' => $lineaExistente->quantity + $request->quantity,
                    'subtotal' => $lineaExistente->unit_price * ($lineaExistente->quantity + $request->quantity),
                ]);
            } else {
                OrderProduct::create([
                    'order_id'   => $order->id,
                    'product_id' => $request->product_id,
                    'quantity'   => $request->quantity,
                    'unit_price' => $request->unit_price,
                    'subtotal'   => $subtotal,
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line'  => $e->getLine(),
            ], 500);
        }

        $order->update([
            'total_price' => $order->products()->sum('subtotal'),
        ]);

        return response()->json([
            'message'  => 'Producte afegit al carret',
            'order_id' => $order->id,  // <-- el frontend lo guarda en localStorage
        ], 200);
    }

    public function show(string $id)
    {
        $items = OrderProduct::with('product.primaryImage')
            ->where('order_id', $id)
            ->get();
    
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
    
        $item = OrderProduct::findOrFail($id);
    
        $item->update([
            'quantity' => $request->quantity,
            'subtotal' => $item->unit_price * $request->quantity,
        ]);
    
        // Actualizamos el total de la order
        $item->order->update([
            'total_price' => $item->order->products()->sum('subtotal'),
        ]);
    
        return response()->json($item->fresh(), 200);
    }
    
    // DELETE /api/cart/{id}  →  elimina un order_product
    public function destroy(string $id)
    {
        $item = OrderProduct::findOrFail($id);
        $order = $item->order;
    
        $item->delete();
    
        // Recalculamos el total
        $order->update([
            'total_price' => $order->products()->sum('subtotal'),
        ]);
    
        return response()->json(['message' => 'Producte eliminat'], 200);
    }

}