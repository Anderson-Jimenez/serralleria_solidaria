import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Box, Settings, Image as ImageIcon, Save } from "lucide-react";

function UsersCreate() {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        phone,
        userType,
        password,
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
        console.log('Usuari creat:', data);
        navigate("/admin/users");
      })
      .catch(err => {
        console.error('Error detallat:', err);
        alert('Error al crear l usuari. Revisa la consola per mes detalls.');
      });
  };

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Crear Usuari</h1>
      <h3 className="dashboard-subtitle">Afegeix un nou usuari</h3>

      <form onSubmit={handleSubmit} className="product-data-box">
        <div className="data-box-header">
          <div className="title-section">
            <h2>Dades del usuari</h2>
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
                  <label htmlFor="code">Nom del usuari: </label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>

                <div className="form-group">
                  <label htmlFor="code">Correu elèctronic: </label>
                  <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>

                <div className="form-group">
                  <label htmlFor="code">Num. Telèfon: </label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="form-group">
                  <label htmlFor="code">Tipus d'usuari: </label>
                  <select name="userType" onChange={(e) => setUserType(e.target.value)} value={userType} required>
                    <option value="user">Usari Basic</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="code">Contrasenya: </label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
              </section>
            )}

          </div>
        </div>

        <div className="data-box-footer">
          <button type="submit" className="save-button">
            <Save size={18} />
            <span>Crear Usuari</span>
          </button>
        </div>
      </form>


    </div>
  );
}
export default UsersCreate;