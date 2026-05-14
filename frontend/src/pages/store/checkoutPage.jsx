import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../../components/payments/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

function CheckoutPage() {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      const orderId = localStorage.getItem('order_id');
      if (!orderId) { navigate('/cart'); return; }
      try {
        const res = await fetch(`http://localhost:8000/api/cart/${orderId}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCartItems(data);
          setSubtotal(data.reduce((acc, item) => acc + Number(item.subtotal), 0));
        } else {
          navigate('/cart');
        }
      } catch (err) {
        console.error(err);
        navigate('/cart');
      }
    };
    fetchCart();
  }, [navigate]);

  useEffect(() => {
    if (subtotal === 0) return;

    const createIntent = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/payment/intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subtotal }), // en euros, el backend converteix a cèntims
        });
        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        console.error('Error creant el payment intent:', err);
      }
    };

    createIntent();
  }, [subtotal]);

  if (cartItems.length === 0) return <div className="checkout-loading">Carregant el carret...</div>;
  if (!clientSecret) return <div>Carregant...</div>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm subtotal={subtotal} cartItems={cartItems} />
    </Elements>
  );
}

export default CheckoutPage;