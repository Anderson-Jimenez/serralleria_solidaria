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
    fetch("http://localhost:8000/api/characteristicTypes")
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
    <div className="dashboard-content">
      <h1 className="dashboard-title">Crear Caracteristica</h1>
      <h3 className="dashboard-subtitle">Afegeix una nova Caracteristica</h3>

      <form onSubmit={handleSubmit} className="product-data-box">
        <div className="data-box-header">
          <div className="title-section">
            <h2>Dades de la caracteristica</h2>
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
                  <label>Type</label>
                  <select name="characteristic_type_id" onChange={(e) => setType(e.target.value)}>
                    {data.map((characteristicType) => (
                      <option value={characteristicType.id}>{characteristicType.type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Descripció</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />
                </div>
              </section>
            )}

          </div>
        </div>

        <div className="data-box-footer">
          <button type="submit" className="save-button">
            <Save size={18} />
            <span>Guardar Producte</span>
          </button>
        </div>
      </form>


    </div>
  );
}
export default CharacteristicsCreate;