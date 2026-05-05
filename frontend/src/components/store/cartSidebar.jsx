import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2 } from 'lucide-react';

function CartSidebar({ isOpen, onClose }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const orderId = localStorage.getItem('order_id');

    if (!orderId) {
      setItems([]);
      return;
    }

    fetch(`http://localhost:8000/api/cart/${orderId}`)
      .then(res => res.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Error cargando carrito:', err);
        setItems([]);
      });
  }, [isOpen]);

  async function cambiarCantidad(item, delta) {
    const nuevaCantidad = item.quantity + delta;
    // eliminar
    if (nuevaCantidad <= 0) {
      try {
        await fetch(`http://localhost:8000/api/cart/${item.id}`, {
          method: 'DELETE',
        });

        setItems(prev => prev.filter(i => i.id !== item.id));
      } catch (err) {
        console.error('Error eliminando item:', err);
      }
      return;
    }

    // actualizar
    try {
      const res = await fetch(`http://localhost:8000/api/cart/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: nuevaCantidad }),
      });

      const data = await res.json();

      setItems(prev =>
        prev.map(i =>
          i.id === item.id ? {...i,...data} : i // actualizamos con la respuesta del backend, que incluye el nuevo subtotal
        )
      );
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

                      const imageUrl = imagePath ? `http://localhost:8000/storage/${imagePath}` : '/placeholder.png';
                      return (
                        <li key={item.id} className="cart-item">
                          <img src={imageUrl} alt={item.product?.name || 'Producto'}
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

                            <button onClick={() => cambiarCantidad(item, +1)}>
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

                  <button className="cart-checkout-btn">
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