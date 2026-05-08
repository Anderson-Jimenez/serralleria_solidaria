import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

function CheckoutPage() {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const [formData, setFormData] = useState({
    shipping_address: '',
    billing_address: '',
    requested_delivery_date: '',
    installation: false,
    installation_address: '',
    observations: '',
  });

  const [installationCost, setInstallationCost] = useState(0);
  const [installationMessage, setInstallationMessage] = useState('');

  const calculateInstallationPrice = (subtotal) => {
    if (subtotal <= 250) return 90;
    if (subtotal <= 500) return 120;
    if (subtotal <= 1000) return 180;
    return null;
  };

  useEffect(() => {
    const fetchCart = async () => {
      const orderId = localStorage.getItem('order_id');
      if (!orderId) {
        navigate('/cart');
        return;
      }
      try {
        const res = await fetch(`http://localhost:8000/api/cart/${orderId}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCartItems(data);
          const sum = data.reduce((acc, item) => acc + Number(item.subtotal), 0);
          setSubtotal(sum);
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
    if (!formData.installation) {
      setInstallationCost(0);
      setInstallationMessage('');
      return;
    }
    const cost = calculateInstallationPrice(subtotal);
    if (cost !== null) {
      setInstallationCost(cost);
      setInstallationMessage('');
    } else {
      setInstallationCost(0);
      setInstallationMessage('Pressupost a consultar (més de 1.000€ en productes)');
    }
  }, [formData.installation, subtotal]);

  const totalConInstalacion = subtotal + (formData.installation ? installationCost : 0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.installation && installationCost === 0 && installationMessage !== '') {
      alert('Per a comandes de més de 1.000€ en productes, si us plau contacta amb nosaltres per a un pressupost personalitzat.');
      return;
    }
    setLoading(true);
    const token = localStorage.getItem('token');
    const orderId = localStorage.getItem('order_id');
    const payload = { ...formData, order_id: orderId, installation_price: installationCost };
    try {
      const res = await fetch('http://localhost:8000/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al procesar pedido');
      }
      localStorage.removeItem('order_id');
      refreshCart();
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className="checkout-loading">Cargando tu carrito...</div>;
  }

  return (
    <div className="checkout-page">
      <h1>Finalitzar comanda</h1>
      <div className="checkout-grid">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label>Direcció d'enviament *</label>
            <input
              type="text"
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Direcció de facturació *</label>
            <input
              type="text"
              name="billing_address"
              value={formData.billing_address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Data de lliurament sol·licitada</label>
            <input
              type="date"
              name="requested_delivery_date"
              value={formData.requested_delivery_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="installation"
                checked={formData.installation}
                onChange={handleChange}
              />
              Necessita instal·lació
            </label>
          </div>
          {formData.installation && (
            <>
              <div className="form-group">
                <label>Adreça d'instal·lació</label>
                <input
                  type="text"
                  name="installation_address"
                  value={formData.installation_address}
                  onChange={handleChange}
                />
              </div>
              {installationMessage ? (
                <div className="installation-warning">{installationMessage}</div>
              ) : (
                <div className="installation-cost">
                  Cost d'instal·lació: {installationCost}€
                </div>
              )}
            </>
          )}
          <div className="form-group">
            <label>Observacions</label>
            <textarea
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <button type="submit" disabled={loading || (formData.installation && installationMessage !== '')}>
            {loading ? 'Processant...' : 'Confirmar comanda'}
          </button>
        </form>

        <div className="order-summary">
          <h2>Resum de la comanda</h2>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                <span>{item.product.name} x{item.quantity}</span>
                <span>{Number(item.subtotal).toFixed(2)}€</span>
              </li>
            ))}
          </ul>
          <p><span>Subtotal productes:</span><span>{subtotal.toFixed(2)}€</span></p>
          {formData.installation && installationCost > 0 && (
            <p><span>Instal·lació:</span><span>{installationCost}€</span></p>
          )}
          <hr />
          <p className="total-row"><strong>Total:</strong><strong>{totalConInstalacion.toFixed(2)}€</strong></p>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;