import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext'; // ← Importa el contexto

function CartSidebar({ isOpen, onClose }) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const { refreshCart } = useCart(); // ← Obtiene la función para refrescar el contador

  // Carga los productos del carrito
  const fetchCart = async () => {
    const orderId = localStorage.getItem('order_id');
    if (!orderId) {
      setItems([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/api/cart/${orderId}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando carrito:', error);
      setItems([]);
    }
  };

  // Al abrir el sidebar, carga los datos
  useEffect(() => {
    if (!isOpen) return;
    fetchCart();
  }, [isOpen]);

  // Escucha el evento 'cart-updated' para refrescar si otro componente modifica el carrito
  useEffect(() => {
    const handleCartUpdate = () => {
      if (isOpen) fetchCart();
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [isOpen]);

  // Cambiar cantidad (+1 / -1) o eliminar
  async function cambiarCantidad(item, delta) {
    const nuevaCantidad = item.quantity + delta;

    // Si la nueva cantidad es 0 o negativa, eliminar el producto
    if (nuevaCantidad <= 0) {
      try {
        await fetch(`http://localhost:8000/api/cart/${item.id}`, {
          method: 'DELETE',
        });
        // Actualizar estado local
        setItems(prev => prev.filter(i => i.id !== item.id));
        // Notificar al contexto para que actualice el contador del Navbar
        refreshCart();
        window.dispatchEvent(new Event('cart-updated'));
      } catch (err) {
        console.error('Error eliminando item:', err);
      }
      return;
    }

    // Actualizar cantidad
    try {
      const res = await fetch(`http://localhost:8000/api/cart/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: nuevaCantidad }),
      });
      const data = await res.json();
      const updatedItem = data.item;

      // Actualizar estado local
      setItems(prev =>
        prev.map(i =>
          i.id === item.id ? { ...i, ...updatedItem } : i
        )
      );
      // Notificar al contexto
      refreshCart();
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error('Error actualizando cantidad:', err);
    }
  }

  const total = items.reduce(
    (acc, item) => acc + Number(item.subtotal || 0),
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="sidebarCart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <header>
              <h2>Carret</h2>
              <button onClick={onClose}>
                <X size={24} />
              </button>
            </header>

            <div className="cart-content">
              {items.length === 0 ? (
                <p className="cart-empty">El carret està buit</p>
              ) : (
                <>
                  <ul className="cart-items">
                    {items.map(item => {
                      const imagePath = item.product?.primary_image?.path;
                      const imageUrl = imagePath
                        ? `http://localhost:8000/storage/${imagePath}`
                        : '/placeholder.png';
                      const sinStock =
                        item.product?.stock !== undefined &&
                        item.quantity >= item.product.stock;

                      return (
                        <li key={item.id} className="cart-item">
                          <img
                            src={imageUrl}
                            alt={item.product?.name || 'Producto'}
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.png';
                            }}
                          />

                          <div className="cart-item-info">
                            <span className="cart-item-name">
                              {item.product?.name || 'Producto'}
                            </span>
                            <span className="cart-item-price">
                              {Number(item.subtotal || 0).toFixed(2)}€
                            </span>
                            {sinStock && (
                              <span className="text-red-500 text-xs">
                                Sin stock disponible
                              </span>
                            )}
                          </div>

                          <div className="cart-item-qty">
                            <button onClick={() => cambiarCantidad(item, -1)}>
                              {item.quantity === 1 ? (
                                <Trash2 size={14} />
                              ) : (
                                <Minus size={14} />
                              )}
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => cambiarCantidad(item, +1)}
                              disabled={sinStock}
                              style={{ opacity: sinStock ? 0.5 : 1 }}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="cart-total">
                    <span>Total</span>
                    <span>{total.toFixed(2)}€</span>
                  </div>

                  <button
                    className="cart-checkout-btn"
                    onClick={() => {
                      onClose?.();
                      navigate('/cart');
                    }}
                  >
                    Fer la comanda
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartSidebar;