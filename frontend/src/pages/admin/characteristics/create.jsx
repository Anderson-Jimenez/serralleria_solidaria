import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CharacteristicsCreate() {

  const navigate = useNavigate();

  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8000/api/characteristics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        type,
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
    <div className="edit-form">
      <h1 className="dashboard-title">Crear Caracteristica</h1>
      <h3 className="dashboard-subtitle">Afegeix una nova Caracteristica</h3>

      <form onSubmit={handleSubmit} className="flex-column">
        <label htmlFor="code">Tipus: </label>
        <input type="text" value={type} onChange={(e) => setType(e.target.value)} />

        <label htmlFor="description">Descripció: </label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <input type="submit" value="Guardar" />

      </form>


    </div>
  );
}
export default CharacteristicsCreate;