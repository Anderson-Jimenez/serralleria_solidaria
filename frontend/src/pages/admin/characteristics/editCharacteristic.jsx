import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CharacteristicsEdit() {
  const { id } = useParams();

  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:8000/api/characteristics/${id}`)
      .then(res => res.json())
      .then(data => {
        setType(data.type);
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
        type,
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
    <div className="edit-form">
      <h1 className="dashboard-title">Editar la caracteristica</h1>
      <h3 className="dashboard-subtitle">Modifica les dades de la caracteristica</h3>

      <form onSubmit={handleSubmit} className="flex-column">
        <label htmlFor="type">Tipus: </label>
        <input type="text" value={type} onChange={(e) => setType(e.target.value)} />

        <label htmlFor="description">Descripció: </label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />


        <input type="submit" value="Guardar" />
      </form>
    </div>
  );
}
export default CharacteristicsEdit;