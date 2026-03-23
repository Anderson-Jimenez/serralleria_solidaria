import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Box, Settings, Image as ImageIcon, Save } from "lucide-react";

function CharacteristicsCreate() {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");

  const [type, setType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8000/api/characteristicTypes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        type,
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
        navigate("/admin/types");
      })
      .catch(err => {
        console.error('Error detallat:', err);
        alert('Error al crear la caracteristica. Revisa la consola per mes detalls.');
      });
  };

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Crear Tipus</h1>
      <h3 className="dashboard-subtitle">Afegeix un nou tipus de caracteristica</h3>

      <form onSubmit={handleSubmit} className="product-data-box">
        <div className="data-box-header">
          <div className="title-section">
            <h2>Dades del tipus de caracteristica</h2>
          </div>
        </div>

        <div className="data-box-body">
          <nav className="data-sidebar">
            <ul>
              <li className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>
                <Info size={18} /> <span className="text">General</span>
              </li>
            </ul>
          </nav>

          <div className="data-content">
            {activeTab === 'general' && (
              <section className="tab-panel">
                <div className="form-group">
                  <label htmlFor="code">Nom del Tipus: </label>
                  <input type="text" value={type} onChange={(e) => setType(e.target.value)} />
                </div>
              </section>
            )}

          </div>
        </div>

        <div className="data-box-footer">
          <button type="submit" className="save-button">
            <Save size={18} />
            <span>Guardar Tipus de Caracteristica</span>
          </button>
        </div>
      </form>


    </div>
  );
}
export default CharacteristicsCreate;