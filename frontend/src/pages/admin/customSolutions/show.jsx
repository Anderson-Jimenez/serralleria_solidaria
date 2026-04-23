import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, FileText, User, BadgeInfo, RefreshCw, CheckCircle } from "lucide-react";

function CustomSolutionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/peticions/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
          setSelectedStatus(res.data.status);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === selectedStatus || updating) return;
    
    setUpdating(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/peticions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSelectedStatus(newStatus);
        setData({ ...data, status: newStatus });
        setShowConfirm(true);
        setTimeout(() => setShowConfirm(false), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending": return "pendingStatus";
      case "in_progress": return "inProgressStatus";
      case "sent": return "sentStatus";
      case "solved": return "solvedStatus";
      case "rejected": return "rejectedStatus";
      default: return "";
    }
  };

  const statusLabels = {
    pending: "Pendent",
    in_progress: "En procés",
    sent: "Enviat",
    solved: "Resolt",
    rejected: "Rebutjat",
  };

  if (!data) {
    return <div className="loading">Cargando petición...</div>;
  }

  return (
    <section className="customSolutionDetails">
      <button className="backButton" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Volver
      </button>
      
      <div className="petitionDetails">
        <div className="detailsHeader">
          <div className="headerInfo">
            <h1 className="petitionTitle">Petició #{data.id}</h1>
            <p className="creationDate">Data de creació: {new Date(data.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Sección Cambiar Estado */}
        <div className="statusSection">
          <div className="statusSectionHeader">
            <RefreshCw size={18} />
            <span>Canviar estat de la petició</span>
          </div>
          <div className="statusButtonsContainer">
            {Object.entries(statusLabels).map(([key, label]) => {
              const statusClass = getStatusClass(key);
              const isActive = selectedStatus === key;
              
              return (
                <button
                  key={key}
                  className={`statusButton ${statusClass} ${isActive ? "active" : ""} ${updating ? "disabled" : ""}`}
                  onClick={() => handleStatusChange(key)}
                  disabled={updating}
                >
                  <span>{label}</span>
                  {isActive && <CheckCircle size={14} className="activeIndicator" />}
                </button>
              );
            })}
          </div>
          {showConfirm && (
            <div className="confirmMessage">
              <CheckCircle size={16} />
              <span>Estat actualitzat correctament a {statusLabels[selectedStatus]}</span>
            </div>
          )}
        </div>

        <div className="detailsPetition">
          <div className="petitionData">
            <h2 className="dataTitle"><User size={16} /> Usuari</h2>
            <p className="dataContent">{data.user_id ?? "No registrat"}</p>
          </div>
          <div className="petitionData">
            <h2 className="dataTitle"><Mail size={16} /> Email</h2>
            <p className="dataContent">{data.user_email}</p>
          </div>
          <div className="petitionData">
            <h2 className="dataTitle"><Phone size={16} /> Telèfon</h2>
            <p className="dataContent">{data.user_phone ?? "No disponible"}</p>
          </div>
          <div className="petitionData">
            <h2 className="dataTitle"><FileText size={16} /> Assumpte</h2>
            <p className="dataContent">{data.user_issue}</p>
          </div>
          <div className="petitionDataFull">
            <h2 className="dataTitle"><BadgeInfo size={16} /> Missatge</h2>
            <p className="dataContent">{data.message}</p>
          </div>
        </div>

        <div className="petitionDocs">
          <h2 className="docsTitle">Documents adjunts</h2>
          <div className="petitionDocsContainer">
            {data.images?.length > 0 ? (
              data.images.map((img) => (
                <div key={img.id} className="imageWrapper">
                  <img
                    src={`http://localhost:8000/storage/${img.path}`}
                    alt="adjunta"
                    className="attachedImage"
                  />
                </div>
              ))
            ) : (
              <p className="noImages">No hi ha documents adjunts</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomSolutionDetails;