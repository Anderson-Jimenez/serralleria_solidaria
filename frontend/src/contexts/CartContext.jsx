import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [orderId, setOrderId] = useState(localStorage.getItem('order_id'));

  const refreshCart = async () => {
    const storedOrderId = localStorage.getItem('order_id');
    if (!storedOrderId) {
      setCartCount(0);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/cart/${storedOrderId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const total = data.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error refrescando carrito:', error);
      setCartCount(0);
    }
  };

  // Función para actualizar orderId y guardarlo en localStorage
  const updateOrderId = (newOrderId) => {
    if (newOrderId) {
      localStorage.setItem('order_id', newOrderId);
      setOrderId(newOrderId);
    } else {
      localStorage.removeItem('order_id');
      setOrderId(null);
    }
    refreshCart(); // Refresca inmediatamente
  };

  // Escuchar cambios en localStorage (desde otras pestañas)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'order_id') {
        setOrderId(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Escuchar evento personalizado 'cart-updated' (misma pestaña)
  useEffect(() => {
    const handleCartUpdated = () => {
      refreshCart();
    };
    window.addEventListener('cart-updated', handleCartUpdated);
    return () => window.removeEventListener('cart-updated', handleCartUpdated);
  }, []);

  // Refrescar cuando cambia orderId (proveniente de otras pestañas)
  useEffect(() => {
    refreshCart();
  }, [orderId]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart, updateOrderId, orderId }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
};