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
    <div className="dashboard-content">
      <h1 className="dashboard-title">Editar Caracteristica</h1>
      <h3 className="dashboard-subtitle">Editar una Caracteristica</h3>

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
                      characteristicType.id === characteristic_type_id ? <option selected value={characteristicType.id}>{characteristicType.type}</option> : <option value={characteristicType.id}>{characteristicType.type}</option>
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
            <span>Actualitzar la Caracteristica</span>
          </button>
        </div>
      </form>


    </div>
  );
}
export default CharacteristicsEdit;