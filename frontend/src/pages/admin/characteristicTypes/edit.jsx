import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Box, Settings, Image as ImageIcon, Save } from "lucide-react";


function CharacteristicsEdit() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("general");

  const [type, setType] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/api/characteristicTypes/${id}`)
      .then(res => res.json())
      .then(data => {
        setType(data.type);
        setFilterType(data.filterType);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/api/characteristicTypes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type,
        filterType,
      })
    })
      .then(res => res.json())
      .then(() => {
        navigate("/admin/types");
      })
      .catch(err => console.error(err));
  };

  return (
        <div className="dashboard-content">
      <h1 className="dashboard-title">Editar Tipus</h1>
      <h3 className="dashboard-subtitle">Editar el tipus de caracteristica</h3>

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
                <div className="form-group">
                  <label htmlFor="code">Tipus de filtratje: </label>
                  <select name="filterType" value={filterType} onChange={(e) => setFilterType(e.target.value)} >
                    <option value="checkbox">Checkbox</option>
                    <option value="select">Select</option>
                    <option value="moreLess">More or Less</option>
                  </select>
                </div>
              </section>
            )}

          </div>
        </div>

        <div className="data-box-footer">
          <button type="submit" className="save-button">
            <Save size={18} />
            <span>Actualitzar Tipus de Caracteristica</span>
          </button>
        </div>
      </form>
    </div>
  );
}
export default CharacteristicsEdit;