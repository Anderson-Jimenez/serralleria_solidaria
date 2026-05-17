import { useEffect, useState } from "react";
import { Eye, FileText } from "lucide-react";
import { Link } from "react-router-dom";

function OrderIndex() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Mapatge d'estats a classes CSS i etiquetes (com al CustomSolutionPetitions)
  const statusClasses = {
    pending: "statusPending",
    paid: "statusPaid",
    processing: "statusProcessing",
    shipped: "statusShipped",
    completed: "statusCompleted",
    cancelled: "statusCancelled",
  };

  const statusLabels = {
    pending: "Pendent",
    paid: "Pagat",
    processing: "En procés",
    shipped: "Enviat",
    completed: "Completat",
    cancelled: "Cancel·lat",
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/orders", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Error carregant comandes");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  if (loading) {
    return (
      <div className="dashboard-caracteristics">
        <p>Carregant comandes...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-caracteristics">
      <h1 className="dashboard-title">Gestió de comandes</h1>
      <h3 className="dashboard-subtitle">Administra les comandes</h3>

      <div className="caracteristics-content">
        <div className="table-container">
          <div className="tableFilters">
            <select
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tots els estats</option>
              <option value="pending">Pendent</option>
              <option value="paid">Pagat</option>
              <option value="processing">En procés</option>
              <option value="shipped">Enviat</option>
              <option value="completed">Completat</option>
              <option value="cancelled">Cancel·lat</option>
            </select>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Adreça enviament</th>
                <th>Enviament</th>
                <th>Instal·lació</th>
                <th>Observacions</th>
                <th>Total</th>
                <th>Estat</th>
                <th>Accions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user.email}</td>
                    <td>{order.detail?.shipping_address || "—"}</td>
                    <td className="text-center">
                      {order.detail?.shipping ? "Sí" : "No"}
                    </td>
                    <td className="text-center">
                      {order.detail?.installation ? "Sí" : "No"}
                    </td>
                    <td>{order.observations || "—"}</td>
                    <td className="text-right">
                      {Number(order.total_price).toFixed(2)} €
                    </td>
                    <td>
                      <span className={statusClasses[order.status] || ""}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="actions">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="action-icon view"
                        title="Veure detalls"
                      >
                        <Eye size={18} /> Veure
                      </Link>
                      <a
                        href={`/orders/pdf/${order.id}`}
                        className="action-icon pdf"
                        title="Descarregar PDF"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText size={18} /> PDF
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                    No hi ha comandes disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderIndex;