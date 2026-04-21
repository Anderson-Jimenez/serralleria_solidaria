import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, FileText, User, BadgeInfo } from "lucide-react";

function CustomSolutionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/peticions/" + id)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!data) {
    return <div className="loading">Cargando petición...</div>;
  }

  const statusClasses = {
    pending: "pendingStatus",
    in_progress: "inProgressStatus",
    sent: "sentStatus",
    solved: "solvedStatus",
    rejected: "rejectedStatus",
  };

  return (
    <div className="petition-details">

      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Volver
      </button>

      <div className="details-header">
        <h1>Petición #{data.id}</h1>

        <span className={statusClasses[data.status]}>
          {data.status}
        </span>
      </div>

      <div className="details-grid">

        <div className="card">
          <h2><User size={16} /> Usuario</h2>
          <p>{data.user_id ?? "Desconocido"}</p>
        </div>

        <div className="card">
          <h2><Mail size={16} /> Email</h2>
          <p>{data.user_email}</p>
        </div>

        <div className="card">
          <h2><Phone size={16} /> Teléfono</h2>
          <p>{data.user_phone ?? "No disponible"}</p>
        </div>

        <div className="card full">
          <h2><FileText size={16} /> Asunto</h2>
          <p>{data.user_issue}</p>
        </div>

        <div className="card full">
          <h2><BadgeInfo size={16} /> Mensaje</h2>
          <p>{data.message}</p>
        </div>

      </div>

      <h2 className="section-title">Imágenes adjuntas</h2>

      <div className="images-grid">
        {data.images?.length > 0 ? (
          data.images.map((img) => (
            <img
              key={img.id}
              src={`http://localhost:8000/storage/${img.path}`}
              alt="adjunta"
              
            />
          ))
        ) : (
          <p className="no-images">No hay imágenes</p>
        )}
      </div>

    </div>
  );
}

export default CustomSolutionDetails;