import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

function CheckoutSuccess() {
    const { updateOrderId } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const newCartId = sessionStorage.getItem('new_cart_id');
        if (newCartId) {
            updateOrderId(newCartId); // actualiza contexto y localStorage
            sessionStorage.removeItem('new_cart_id');
        }
        navigate('/'); // redirige a la página principal
    }, [updateOrderId, navigate]);

    return <div>Procesando tu pedido...</div>;
}

export default CheckoutSuccess;