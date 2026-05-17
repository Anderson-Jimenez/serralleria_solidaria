import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/user/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/user/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const order = await res.json();
      setSelectedOrder(order);
    } catch (error) {
      console.error(error);
    }
  };

  const statusLabel = (status) => {
    const map = { pending: 'Pendent', paid: 'Pagat', cancelled: 'Cancel·lat' };
    return map[status] ?? status;
  };

  if (loading) return <div className="profile-loading">Carregant perfil...</div>;

  return (
    <div className="profile-container">

      {/* Capçalera */}
      <div className="profile-hero">
        <div className="profile-hero-left">
          <span className="profile-label">EL MEU COMPTE</span>
          <h1 className="profile-title">Hola, <span>{user?.username}</span></h1>
          <div className="profile-divider" />
          <div className="profile-info">
            <p><span>Nom</span>{user?.username}</p>
            <p><span>Email</span>{user?.email}</p>
          </div>
        </div>
        <div className="profile-hero-stats">
          <div className="profile-stat">
            <strong>{orders.length}</strong>
            <span>COMANDES TOTALS</span>
          </div>
          <div className="profile-stat">
            <strong>
              {orders.reduce((acc, o) => acc + parseFloat(o.total_price || 0), 0).toFixed(2)}€
            </strong>
            <span>TOTAL GASTAT</span>
          </div>
        </div>
      </div>

      {/* Historial de comandes */}
      <div className="orders-section">
        <div className="orders-section-header">
          <span className="profile-label">HISTORIAL</span>
          <h2 className="orders-title">Les meves <span>Comandes</span></h2>
          <div className="profile-divider" />
        </div>

        {orders.length === 0 ? (
          <p className="no-orders">No has fet cap comanda encara.</p>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order.id} className="order-card" onClick={() => viewOrderDetails(order.id)}>
                <div className="order-card-top">
                  <span className="order-id">#{order.id}</span>
                  <span className={`order-status status-${order.status}`}>
                    {statusLabel(order.status)}
                  </span>
                </div>
                <div className="order-card-body">
                  <div className="order-total">{parseFloat(order.total_price).toFixed(2)}€</div>
                  <div className="order-meta">
                    <span>{new Date(order.created_at).toLocaleDateString('ca-ES')}</span>
                    <span>{order.products.length} producte(s)</span>
                  </div>
                </div>
                <div className="order-card-footer">
                  Veure detall →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="profile-label">DETALL</span>
                <h2>Comanda <span>#{selectedOrder.id}</span></h2>
              </div>
              <div className="modal-header-actions">
                <a href={`/orders/pdf/${selectedOrder.id}`} className="pdf-btn" title="Descarregar PDF">
                  <FileText size={18} /> PDF
                </a>
                <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
              </div>
            </div>

            <div className="modal-meta">
              <p><span>Data</span>{new Date(selectedOrder.created_at).toLocaleString('ca-ES')}</p>
              <p><span>Estat</span>
                <strong className={`status-${selectedOrder.status}`}>
                  {statusLabel(selectedOrder.status)}
                </strong>
              </p>
              <p><span>Adreça</span>{selectedOrder.detail?.shipping_address || '—'}</p>
              <p><span>Observacions</span>{selectedOrder.observations || 'Cap'}</p>
            </div>

            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Producte</th>
                  <th>Quantitat</th>
                  <th>Preu unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.pivot.quantity}</td>
                    <td>{item.pivot.unit_price}€</td>
                    <td>{item.pivot.subtotal}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;