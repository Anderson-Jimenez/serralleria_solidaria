import { Elements, PaymentElement, AddressElement, LinkAuthenticationElement,useStripe, useElements } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/orders`,
            },
        });

        if (error) {
            alert(error.message);
            setLoading(false);
        }
        // Si va bé, Stripe redirigeix sol a return_url
    };

    return (
        <form onSubmit={handleSubmit}>
            <AddressElement options={{ mode: 'shipping' }} />
            <PaymentElement />  {/* ← Stripe posa aquí targeta, Bizum, etc. */}
            <button type="submit" disabled={!stripe || loading}>
                {loading ? 'Processant...' : 'Pagar'}
            </button>
        </form>
    );
}

export default CheckoutForm;