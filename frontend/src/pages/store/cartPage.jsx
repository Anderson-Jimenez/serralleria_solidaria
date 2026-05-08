import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext'; // ← Importa el contexto

function CartPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { refreshCart, updateOrderId } = useCart(); // ← Funciones del contexto

    const SHIPPING_PRICE = 9;

    // =====================================================
    // LOAD CART
    // =====================================================
    useEffect(() => {
        cargarCarrito();
    }, []);

    async function cargarCarrito() {
        try {
            const orderId = localStorage.getItem('order_id');
            if (!orderId) {
                setItems([]);
                setLoading(false);
                return;
            }
            const res = await fetch(`http://localhost:8000/api/cart/${orderId}`);
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    // =====================================================
    // CHANGE QUANTITY
    // =====================================================
    async function cambiarCantidad(item, delta) {
        const nuevaCantidad = item.quantity + delta;

        // Eliminar si la cantidad es 0 o negativa
        if (nuevaCantidad <= 0) {
            try {
                await fetch(`http://localhost:8000/api/cart/${item.id}`, {
                    method: 'DELETE',
                });
                setItems(prev => prev.filter(i => i.id !== item.id));
                // 🔥 Actualizar el contador global
                refreshCart();
                window.dispatchEvent(new Event('cart-updated'));
            } catch (err) {
                console.error(err);
            }
            return;
        }

        // Validar stock (frontend)
        if (nuevaCantidad > item.product?.stock) return;

        try {
            const res = await fetch(`http://localhost:8000/api/cart/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: nuevaCantidad }),
            });
            const data = await res.json();
            if (!res.ok) {
                console.error(data.error);
                return;
            }
            const updatedItem = data.item;
            setItems(prev =>
                prev.map(i =>
                    i.id === item.id ? { ...i, ...updatedItem } : i
                )
            );
            // 🔥 Actualizar el contador global
            refreshCart();
            window.dispatchEvent(new Event('cart-updated'));
        } catch (err) {
            console.error(err);
        }
    }

    // =====================================================
    // CLEAR CART
    // =====================================================
    async function vaciarCarrito() {
        try {
            await Promise.all(
                items.map(item =>
                    fetch(`http://localhost:8000/api/cart/${item.id}`, {
                        method: 'DELETE',
                    })
                )
            );
            localStorage.removeItem('order_id');
            updateOrderId(null); // 🔥 Actualiza el contexto (orderId = null)
            setItems([]);
            // 🔥 Refrescar contador (quedará a 0)
            refreshCart();
            window.dispatchEvent(new Event('cart-updated'));
        } catch (err) {
            console.error(err);
        }
    }

    // =====================================================
    // CHECKOUT
    // =====================================================
    async function finalizarCompra() {
        try {
            const orderId = localStorage.getItem('order_id');
            if (!orderId) return;
            const totalFinal = total + SHIPPING_PRICE;
            await fetch(`http://localhost:8000/api/orders/${orderId}/total`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ total_price: totalFinal }),
            });
            navigate('/checkout');
        } catch (err) {
            console.error(err);
        }
    }

    // =====================================================
    // TOTAL
    // =====================================================
    const total = items.reduce(
        (acc, item) => acc + Number(item.subtotal || 0),
        0
    );

    // =====================================================
    // LOADING
    // =====================================================
    if (loading) {
        return (
            <div className="cartPage">
                <p>Carregant...</p>
            </div>
        );
    }

    // =====================================================
    // EMPTY
    // =====================================================
    if (items.length === 0) {
        return (
            <div className="cartPage empty">
                <div className="empty-content">
                    <ShoppingBag size={64} />
                    <h1>El carret està buit</h1>
                    <p>Encara no has afegit cap producte al teu carret.</p>
                    <Link to="/products" className="continue-shopping">
                        Continuar comprant
                    </Link>
                </div>
            </div>
        );
    }

    // =====================================================
    // VIEW
    // =====================================================
    return (
        <div className="cartPage">
            {/* LEFT */}
            <div className="cartPage-left">
                <div className="cart-header">
                    <div>
                        <span className="subtitle">SERRALLERIA SOLIDÀRIA</span>
                        <h1>El teu <span>carret</span></h1>
                    </div>
                    <button className="clear-cart" onClick={vaciarCarrito}>
                        Buidar carret
                    </button>
                </div>

                {/* ITEMS */}
                <div className="cart-items">
                    {items.map(item => {
                        const imagePath = item.product?.primary_image?.path;
                        const imageUrl = imagePath
                            ? `http://localhost:8000/storage/${imagePath}`
                            : '/placeholder.png';
                        const sinStock =
                            item.product?.stock !== undefined &&
                            item.quantity >= item.product.stock;

                        return (
                            <div key={item.id} className="cart-item">
                                {/* IMAGE */}
                                <div
                                    className="imageContainer"
                                    onClick={() => navigate(`/producte/${item.product?.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={imageUrl}
                                        alt={item.product?.name || 'Producto'}
                                        onError={(e) => {
                                            e.currentTarget.src = '/placeholder.png';
                                        }}
                                    />
                                </div>

                                {/* INFO */}
                                <div className="cart-info">
                                    <span className="category">
                                        {item.product?.category?.name || 'PRODUCTE'}
                                    </span>
                                    <h2
                                        onClick={() => navigate(`/producte/${item.product?.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {item.product?.name || 'Producto'}
                                    </h2>
                                    <p
                                        onClick={() => navigate(`/producte/${item.product?.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {item.product?.description || 'Sense descripció'}
                                    </p>
                                    <div className="price-group">
                                        <span className="current">
                                            {Number(item.unit_price || 0).toFixed(2)}€
                                        </span>
                                    </div>
                                </div>

                                {/* ACTIONS */}
                                <div className="cart-actions">
                                    <div className="quantity">
                                        <button onClick={() => cambiarCantidad(item, -1)}>
                                            {item.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => cambiarCantidad(item, +1)} disabled={sinStock}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    {sinStock && (
                                        <span style={{ fontSize: '.75rem', color: '#d10000', fontWeight: 700 }}>
                                            Sense stock
                                        </span>
                                    )}
                                    <div className="subtotal">
                                        {Number(item.subtotal || 0).toFixed(2)}€
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SUMMARY */}
            <aside className="cart-summary">
                <div className="summary-card">
                    <span className="summary-subtitle">RESUM</span>
                    <h2>La teva <span>comanda</span></h2>
                    <div className="summary-row">
                        <span>Productes</span>
                        <span>{items.length}</span>
                    </div>
                    <div className="summary-row">
                        <span>Enviament</span>
                        <span>9€</span>
                    </div>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>{total.toFixed(2)}€</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>{(total + SHIPPING_PRICE).toFixed(2)}€</span>
                    </div>
                    <button className="checkout-btn" onClick={finalizarCompra}>
                        Finalitzar compra
                    </button>
                    <Link to="/products" className="continue-link">
                        Continuar comprant
                    </Link>
                </div>
            </aside>
        </div>
    );
}

export default CartPage;