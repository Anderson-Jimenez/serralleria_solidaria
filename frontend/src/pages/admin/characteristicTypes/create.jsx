import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CharacteristicsCreate() {

  const navigate = useNavigate();

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
        navigate("/admin/characteristics");
      })
      .catch(err => {
        console.error('Error detallat:', err);
        alert('Error al crear la caracteristica. Revisa la consola per mes detalls.');
      });
  };

  return (
    <div className="edit-form">
      <h1 className="dashboard-title">Crear Tipus</h1>
      <h3 className="dashboard-subtitle">Afegeix un nou tipus de caracteristica</h3>

      <form onSubmit={handleSubmit} className="flex-column">
        <label htmlFor="code">Nom del Tipus: </label>
        <input type="text" value={type} onChange={(e) => setType(e.target.value)} />

        <input type="submit" value="Guardar" />

      </form>


    </div>
  );
}
export default CharacteristicsCreate;