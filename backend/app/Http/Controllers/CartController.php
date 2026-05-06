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

   public function store(Request $request){
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'order_id'   => 'nullable|integer|exists:orders,id',
        ]);
        $itemResponse = null;
        try {
            $userId = auth()->id();

            // obtener o crear pedido
            if ($request->order_id) {
                $order = Order::findOrFail($request->order_id);
            } else {
                $order = Order::create([
                    'user_id'     => $userId,
                    'status'      => 'cart',
                    'total_price' => 0,
                ]);
            }

            DB::transaction(function () use ($request, &$order, &$itemResponse) { // Transaccion que sirve para asegurar que el stock se actualice correctamente y evitar problemas de concurrencia

                //Bloquear producto para evitar errores si user 1 y user 2 intentan comprar el mismo producto al mismo tiempo
                $product = Product::lockForUpdate()->findOrFail($request->product_id);

                $lineaExistente = OrderProduct::where('order_id', $order->id)
                    ->where('product_id', $product->id)
                    ->first();

                $cantidadTotal = $request->quantity;

                if ($lineaExistente) {
                    $cantidadTotal += $lineaExistente->quantity;
                }

                // Validar stock
                if ($cantidadTotal > $product->stock) {
                    throw new \Exception('No hay suficiente stock');
                }

                // Crear o actualizar línea
                if ($lineaExistente) {
                    $lineaExistente->update([
                        'quantity'   => $cantidadTotal,
                        'unit_price' => $lineaExistente->unit_price,
                        'subtotal'   => $lineaExistente->unit_price * $cantidadTotal,
                    ]);
                    $itemResponse = $lineaExistente;
                } else {
                    $itemResponse = OrderProduct::create([
                        'order_id'   => $order->id,
                        'product_id' => $product->id,
                        'quantity'   => $request->quantity,
                        'unit_price' => $product->sale_price,
                        'subtotal'   => $product->sale_price * $request->quantity,
                    ]);
                }

                // Recalcular total del pedido
                $order->update([
                    'total_price' => $order->products()->sum('subtotal'),
                ]);
            });

            // Devolver item completo con producto
            $item = OrderProduct::with('product.primaryImage')
                ->find($itemResponse->id);

            return response()->json([
                'message'  => 'Producto añadido al carrito',
                'order_id' => $order->id,
                'item'     => $item,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
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
    
        return response()->json([
            'item' => $item->fresh()
        ], 200);
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