import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Mail, Phone, User, 
  BadgeInfo, RefreshCw, CheckCircle, 
  MapPin, Calendar, Truck, Wrench, CreditCard, Package
} from "lucide-react";

const API = "http://localhost:8000";

function OrderShow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Mapeo de estados a clases CSS (igual que en el SCSS que ya tienes)
  const getStatusClass = (status) => {
    const classes = {
      pending:    "order-pending",     // o pendingStatus según definición
      paid:       "order-paid",
      processing: "order-processing",
      shipped:    "order-shipped",
      completed:  "order-completed",
      cancelled:  "order-cancelled",
    };
    return classes[status] || "";
  };

  const statusLabels = {
    pending:    "Pendent",
    paid:       "Pagat",
    processing: "Processant",
    shipped:    "Enviat",
    completed:  "Completat",
    cancelled:  "Cancel·lat",
  };

  useEffect(() => {
    fetch(`${API}/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setSelectedStatus(data.status);
      })
      .catch((err) => console.error("Error carregant comanda:", err));
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === selectedStatus || updating) return;
    setUpdating(true);
    try {
      const response = await fetch(`${API}/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (result.success) {
        setSelectedStatus(newStatus);
        setOrder({ ...order, status: newStatus });
        setShowConfirm(true);
        setTimeout(() => setShowConfirm(false), 3000);
      } else {
        alert("Error actualitzant l'estat");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No s'ha pogut actualitzar l'estat");
    } finally {
      setUpdating(false);
    }
  };

  if (!order) return <div className="loading">Carregant comanda...</div>;

  // Datos del usuario
  const user = order.user || { name: "Usuari eliminat", email: "—", phone: "—" };
  const detail = order.detail || {};

  // Calcular total de productos (si no confiamos en order.total_price)
  const totalProductos = order.products?.reduce((sum, p) => sum + p.pivot.quantity, 0) || 0;

  return (
    <section className="customSolutionDetails">  {/* reutilizamos la misma clase CSS */}
      <button className="backButton" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Tornar
      </button>

      <div className="petitionDetails">

        {/* HEADER */}
        <div className="detailsHeader">
          <div className="headerInfo">
            <h1 className="petitionTitle">Comanda #{order.id}</h1>
            <p className="creationDate">
              Data: {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* GESTIÓN DE ESTADO */}
        <div className="statusSection">
          <div className="statusSectionHeader">
            <RefreshCw size={16} /> <span>Estat de la comanda</span>
          </div>
          <div className="statusButtonsContainer">
            {Object.entries(statusLabels).map(([key, label]) => {
              const isActive = selectedStatus === key;
              return (
                <button
                  key={key}
                  className={`statusButton ${getStatusClass(key)} ${isActive ? "active" : ""}`}
                  onClick={() => handleStatusChange(key)}
                  disabled={updating}
                >
                  {label}
                  {isActive && <CheckCircle size={14} />}
                </button>
              );
            })}
          </div>
          {showConfirm && (
            <div className="statusConfirmMessage">
              <CheckCircle size={14} />
              <span>Estat actualitzat a {statusLabels[selectedStatus]}</span>
            </div>
          )}
        </div>

        {/* INFORMACIÓN DEL CLIENTE */}
        <div className="detailsPetition">
          <div className="petitionData">
            <h2 className="dataTitle"><User size={16} /> Client</h2>
            <p className="dataContent">{user.name}</p>
          </div>
          <div className="petitionData">
            <h2 className="dataTitle"><Mail size={16} /> Email</h2>
            <p className="dataContent">{user.email}</p>
          </div>
          <div className="petitionData">
            <h2 className="dataTitle"><Phone size={16} /> Telèfon</h2>
            <p className="dataContent">{user.phone ?? "No indicat"}</p>
          </div>
          <div className="petitionData">
            <h2 className="dataTitle"><MapPin size={16} /> Adreça d'enviament</h2>
            <p className="dataContent">{detail.shipping_address || "No especificada"}</p>
          </div>
          <div className="petitionData">
            <h2 className="dataTitle"><Calendar size={16} /> Data sol·licitada</h2>
            <p className="dataContent">{detail.requested_delivery_date || "—"}</p>
          </div>
          <div className="petitionData">
            <h2 className="dataTitle"><Truck size={16} /> Enviament</h2>
            <p className="dataContent">{detail.shipping ? "Sí" : "No"}</p>
          </div>
          <div className="petitionData">
            <h2 className="dataTitle"><Wrench size={16} /> Instal·lació</h2>
            <p className="dataContent">
              {detail.installation ? `Sí (${detail.installation_price || 0}€)` : "No"}
            </p>
          </div>
          <div className="petitionDataFull">
            <h2 className="dataTitle"><BadgeInfo size={16} /> Observacions</h2>
            <p className="dataContent">{order.observations || "Cap observació"}</p>
          </div>
        </div>

        {/* PRODUCTOS */}
        <div className="petitionDocs" style={{ marginTop: "2rem" }}>
          <h2 className="docsTitle"><Package size={18} /> Productes</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="orderProductsTable">
              <thead>
                <tr>
                  <th>Producte</th>
                  <th>Quantitat</th>
                  <th>Preu unitari</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.products?.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.pivot.quantity}</td>
                    <td>{product.pivot.unit_price} €</td>
                    <td>{product.pivot.subtotal} €</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" style={{ textAlign: "right" }}><strong>Total</strong></td>
                  <td><strong>{order.total_price} €</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* METADATOS ADICIONALES (opcional) */}
        <div className="petitionDocs" style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", gap: "2rem", fontSize: "0.85rem", color: "#666" }}>
            <span><CreditCard size={14} /> Total pagat: {order.total_price}€</span>
            <span>🕒 Última actualització: {new Date(order.updated_at).toLocaleString()}</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default OrderShow;