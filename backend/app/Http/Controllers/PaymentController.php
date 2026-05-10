<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;

class PaymentController extends Controller
{
    public function createIntent(Request $request)
    {
        try {
            $stripe = new \Stripe\StripeClient(config('services.stripe.secret'));

            $paymentIntent = $stripe->paymentIntents->create([
                'amount' => 2000,
                'currency' => 'eur',
                'automatic_payment_methods' => ['enabled' => true],
                'metadata' => ['country' => 'ES'],
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'success' =>true,
            ]);

        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage()
            ], 500);
        }

    }
}
