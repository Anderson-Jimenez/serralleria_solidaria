import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // para modal o detalle
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
      setOrders(data.data); // porque usamos paginate, los datos vienen en data
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

  if (loading) return <div className="profile-loading">Cargando perfil...</div>;

  return (
    <div className="profile-container">
      {/* Datos del usuario */}
      <div className="profile-header">
        <h1>Mi perfil</h1>
        <div className="user-info">
          <p><strong>Nombre:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          {/* Agrega más campos si los tienes: teléfono, dirección, etc. */}
        </div>
      </div>

      {/* Historial de pedidos */}
      <div className="orders-history">
        <h2>Mis pedidos</h2>
        {orders.length === 0 ? (
          <p>No has realizado ningún pedido aún.</p>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order.id} className="order-card" onClick={() => viewOrderDetails(order.id)}>
                <div className="order-header">
                  <span className="order-id">Pedido #{order.id}</span>
                  <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="order-status">
                  Estado: <span className={`status-${order.status}`}>{order.status}</span>
                </div>
                <div className="order-total">
                  Total: <strong>{order.total_price}€</strong>
                </div>
                <div className="order-items-count">
                  {order.products.length} producto(s)
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal o vista de detalles del pedido */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Detalles del pedido #{selectedOrder.id}</h2>
            <p>Fecha: {new Date(selectedOrder.created_at).toLocaleString()}</p>
            <p>Estado: {selectedOrder.status}</p>
            <p>Dirección de envío: {selectedOrder.detail?.shipping_address}</p>
            <p>Observaciones: {selectedOrder.observations || 'Ninguna'}</p>
            <h3>Productos</h3>
            <table className="order-items-table">
              <thead>
                <tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr>
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
            <button onClick={() => setSelectedOrder(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;