import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CharacteristicsEdit() {
  const { id } = useParams();

  const [characteristic_type_id, setType] = useState("");
  const [data, setData] = useState([]);
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/characteristicTypes")
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
    <div className="edit-form">
      <h1 className="dashboard-title">Editar la caracteristica</h1>
      <h3 className="dashboard-subtitle">Modifica les dades de la caracteristica</h3>

      <form onSubmit={handleSubmit} className="flex-column">
        <label htmlFor="code">Tipus: </label>
        <select name="characteristic_type_id" onChange={(e) => setType(e.target.value)}>
          {data.map((characteristicType) => (
            characteristicType.id === characteristic_type_id ? <option selected value={characteristicType.id}>{characteristicType.type}</option> : <option value={characteristicType.id}>{characteristicType.type}</option>
          ))}
        </select>

        <label htmlFor="description">Descripció: </label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />


        <input type="submit" value="Guardar" />
      </form>
    </div>
  );
}
export default CharacteristicsEdit;