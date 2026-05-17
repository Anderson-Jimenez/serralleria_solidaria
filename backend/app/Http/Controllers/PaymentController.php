<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Stripe\Stripe;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use App\Models\OrderDetail;
class PaymentController extends Controller
{
    public function createIntent(Request $request)
    {
        try {
            $stripe = new \Stripe\StripeClient(config('services.stripe.secret'));
            $paymentIntent = $stripe->paymentIntents->create([
                'amount' => (int) round($request->subtotal * 100),
                'currency' => 'eur',
                'automatic_payment_methods' => ['enabled' => true],
                'metadata' => [
                    'country' => 'ES',
                ],
            ]);
            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'success' => true,
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function updateIntent(Request $request)
    {
        try {
            $stripe = new \Stripe\StripeClient(config('services.stripe.secret'));

            $stripe->paymentIntents->update($request->paymentIntentId, [
                'amount' => (int) round($request->total * 100),
            ]);

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}