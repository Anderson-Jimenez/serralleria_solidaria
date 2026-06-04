import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Box, Settings, Image as ImageIcon, Save } from "lucide-react";

function CharacteristicsEdit() {
  const { id } = useParams();

  const [characteristic_type_id, setType] = useState("");
  const [data, setData] = useState([]);
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetch("http://localhost:8000/api/characteristic-types")
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error(error));

  }, []);

  useEffect(() => {
    fetch(`http://localhost:8000/api/characteristics/${id}`)
      .then(res => res.json())
      .then(data => {
        setType(data.characteristic_type_id);
        setDescription(data.description);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/api/characteristics/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        characteristic_type_id,
        description,
      })
    })
      .then(res => res.json())
      .then(() => {
        navigate("/admin/characteristics");
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="dashboard-content" role="main" aria-labelledby="edit-characteristic-title">
      <h1 className="dashboard-title" id="edit-characteristic-title">Editar Caracteristica</h1>
      <h3 className="dashboard-subtitle">Editar una Caracteristica</h3>

      <form onSubmit={handleSubmit} className="product-data-box" aria-labelledby="edit-characteristic-title">
        <div className="data-box-header">
          <div className="title-section">
            <h2>Dades de la caracteristica</h2>
          </div>
        </div>

        <div className="data-box-body">
          <nav className="data-sidebar" aria-label="Seccions del formulari">
            <ul role="tablist" aria-label="Pestanyes del formulari">
              <li 
                className={activeTab === 'general' ? 'active' : ''} 
                onClick={() => setActiveTab('general')}
                role="tab"
                tabIndex={activeTab === 'general' ? 0 : -1}
                aria-selected={activeTab === 'general'}
                aria-controls="general-panel"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTab('general');
                  }
                }}
              >
                <Info size={18} aria-hidden="true" /> <span className="text">General</span>
              </li>
            </ul>
          </nav>

          <div className="data-content">
            {activeTab === 'general' && (
              <section 
                className="tab-panel" 
                id="general-panel"
                role="tabpanel"
                aria-labelledby="general-tab"
              >
                <div className="form-group">
                  <label htmlFor="characteristic-type">Type</label>
                  <select 
                    id="characteristic-type"
                    name="characteristic_type_id" 
                    onChange={(e) => setType(e.target.value)}
                    aria-required="true"
                    aria-label="Tipus de característica"
                    value={characteristic_type_id || ""}
                  >
                    <option value="">Selecciona un tipus...</option>
                    {data.map((characteristicType) => (
                      <option key={characteristicType.id} value={characteristicType.id}>
                        {characteristicType.type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="characteristic-description">Descripció</label>
                  <textarea 
                    id="characteristic-description"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows="4"
                    aria-required="true"
                    aria-label="Descripció de la característica"
                  />
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="data-box-footer">
          <button 
            type="submit" 
            className="save-button"
            aria-label="Actualitzar característica"
          >
            <Save size={18} aria-hidden="true" />
            <span>Actualitzar la Caracteristica</span>
          </button>
        </div>
      </form>
    </div>
  );
}
export default CharacteristicsEdit;
