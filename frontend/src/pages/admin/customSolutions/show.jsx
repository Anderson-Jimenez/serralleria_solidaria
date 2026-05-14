import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Mail, Phone, FileText, User, 
  BadgeInfo, RefreshCw, CheckCircle, Download,
  FileImage, FileSpreadsheet, FileType2, File
} from "lucide-react";

const API = "http://localhost:8000";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Detecta el tipo de archivo por su extensión */
const getFileType = (path) => {
  const ext = path.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) return 'image';
  if (ext === 'pdf')                                                 return 'pdf';
  if (['csv', 'xls', 'xlsx'].includes(ext))                         return 'spreadsheet';
  if (['doc', 'docx'].includes(ext))                                 return 'word';
  return 'other';
};

/** Icono según tipo (con color propio) */
const FileTypeIcon = ({ path, size = 32 }) => {
  const type = getFileType(path);
  const icons = {
    image:       <FileImage       size={size} className="docIcon iconImage"       />,
    pdf:         <FileType2       size={size} className="docIcon iconPdf"         />,
    spreadsheet: <FileSpreadsheet size={size} className="docIcon iconSpreadsheet" />,
    word:        <FileText        size={size} className="docIcon iconWord"        />,
    other:       <File            size={size} className="docIcon iconOther"       />,
  };
  return icons[type];
};

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────

function CustomSolutionDetails() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [data,           setData]           = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showConfirm,    setShowConfirm]    = useState(false);
  const [updating,       setUpdating]       = useState(false);

  useEffect(() => {
    fetch(`${API}/api/peticions/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
          setSelectedStatus(res.data.status);
        }
      })
      .catch((err) => console.error("Error al carregar:", err));
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === selectedStatus || updating) return;
    setUpdating(true);
    try {
      const response = await fetch(`${API}/api/peticions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      console.error("Error actualitzant estat:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusClass = (status) => {
    const classes = {
      pending:     "pendingStatus",
      in_progress: "inProgressStatus",
      sent:        "sentStatus",
      solved:      "solvedStatus",
      rejected:    "rejectedStatus",
    };
    return classes[status] || "";
  };

  const statusLabels = {
    pending:     "Pendent",
    in_progress: "En procés",
    sent:        "Enviat",
    solved:      "Resolt",
    rejected:    "Rebutjat",
  };

  if (!data) return <div className="loading">Carregant detalls de la petició...</div>;

  return (
    <section className="customSolutionDetails">
      <button className="backButton" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Tornar
      </button>

      <div className="petitionDetails">

        {/* HEADER */}
        <div className="detailsHeader">
          <div className="headerInfo">
            <h1 className="petitionTitle">Petició #{data.id}</h1>
            <p className="creationDate">Data: {new Date(data.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* GESTIÓN DE ESTADO */}
        <div className="statusSection">
          <div className="statusSectionHeader">
            <RefreshCw size={16} /> <span>Estat de la sol·licitud</span>
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
            <h2 className="dataTitle"><User size={16} /> Usuari ID</h2>
            <p className="dataContent">{data.user_id ?? "Visitant"}</p>
          </div>
          <div className="petitionData">
            <h2 className="dataTitle"><Mail size={16} /> Email</h2>
            <p className="dataContent">{data.user_email}</p>
          </div>
          <div className="petitionData">
            <h2 className="dataTitle"><Phone size={16} /> Telèfon</h2>
            <p className="dataContent">{data.user_phone ?? "No indicat"}</p>
          </div>
          <div className="petitionData">
            <h2 className="dataTitle"><FileText size={16} /> Assumpte</h2>
            <p className="dataContent">{data.user_issue}</p>
          </div>
          <div className="petitionDataFull">
            <h2 className="dataTitle"><BadgeInfo size={16} /> Missatge del client</h2>
            <p className="dataContent">{data.message}</p>
          </div>
        </div>

        {/* ARCHIVOS ADJUNTOS */}
        <div className="petitionDocs">
          <h2 className="docsTitle">Arxius adjunts</h2>
          <div className="petitionDocsContainer">
            {data.images?.length > 0 ? (
              data.images.map((img) => {
                const previewUrl = `${API}/storage/${img.path}`;
                const fileName   = img.path.split('/').pop();
                const fileType   = getFileType(img.path);

                return (
                  <div key={img.id} className={`documentCard fileType-${fileType}`}>
                    <div className="previewContainer">
                      {fileType === 'image' ? (
                        <img src={previewUrl} alt="Adjunt" className="imgPreview" />
                      ) : (
                        <>
                          <FileTypeIcon path={img.path} size={36} />
                          <span className="docName">{fileName}</span>
                          <span className="docExt">{img.path.split('.').pop().toUpperCase()}</span>
                        </>
                      )}
                    </div>

                    {/*
                      Descarga via endpoint Laravel:
                      Storage::download() envia Content-Disposition: attachment
                      → el browser guarda el archivo directamente, sin abrir pestaña.
                    */}
                    <a
                      href={`${API}/api/peticions/download/${img.id}`}
                      className="downloadBtnSmall"
                      title="Descarregar"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                );
              })
            ) : (
              <p className="noImages">No hi ha fitxers adjunts en aquesta petició.</p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

export default CustomSolutionDetails;