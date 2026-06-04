import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Box, Settings, Image as ImageIcon, Save } from "lucide-react";

function CharacteristicsCreate() {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");

  const [data, setData] = useState([]);

  const [characteristic_type_id, setType] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/characteristic-types")
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error(error));

  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8000/api/characteristics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        characteristic_type_id,
        description,
      })
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(JSON.stringify(errorData));
        }
        return res.json();
      })
      .then(data => {
        console.log('Caracteristica creada:', data);
        navigate("/admin/characteristics");
      })
      .catch(err => {
        console.error('Error detallat:', err);
        alert('Error al crear la caracteristica. Revisa la consola per mes detalls.');
      });
  };

  return (
    <div className="dashboard-content" role="main" aria-labelledby="create-characteristic-title">
      <h1 className="dashboard-title" id="create-characteristic-title">Crear Caracteristica</h1>
      <h3 className="dashboard-subtitle">Afegeix una nova Caracteristica</h3>

      <form onSubmit={handleSubmit} className="product-data-box" aria-labelledby="create-characteristic-title">
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
            aria-label="Guardar característica"
          >
            <Save size={18} aria-hidden="true" />
            <span>Guardar Producte</span>
          </button>
        </div>
      </form>
    </div>
  );
}
export default CharacteristicsCreate;