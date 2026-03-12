import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CharacteristicsEdit() {
  const { id } = useParams();

  const [type, setType] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/api/characteristicTypes/${id}`)
      .then(res => res.json())
      .then(data => {
        setType(data.type);
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
      <h1 className="dashboard-title">Editar el tipus</h1>
      <h3 className="dashboard-subtitle">Modifica les dades del Tipus</h3>

      <form onSubmit={handleSubmit} className="flex-column">

        <label htmlFor="type">Tipus: </label>
        <input type="text" value={type} onChange={(e) => setType(e.target.value)} />

        <input type="submit" value="Guardar" />
      </form>
    </div>
  );
}
export default CharacteristicsEdit;