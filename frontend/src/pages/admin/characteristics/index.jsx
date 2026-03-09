import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Characteristics() {

  const [characteristics, setCharacteristics] = useState([]);
  const [id, setId] = useState("");

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/api/characteristics/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
  }

  useEffect(() => {
    fetch("http://localhost:8000/api/characteristics")
      .then(response => response.json())
      .then(data => setCharacteristics(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="dashboard-content">
      <h1>Caracteristiques</h1>
      <div className="caracteristics-content">
        <div className="table-container">
          <div className="tableFilters">
            <input type="text" name="" id="" placeholder="Buscar Caracteristiques..." />

            <select name="" id="">

            </select>

            <Link to="/admin/characteristics/create">Afegir Caracteristica +</Link>

          </div>
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>ID</th>
                <th>Tipus</th>
                <th>Descripció</th>
              </tr>
            </thead>
            <tbody>
              {characteristics.map((characteristics) => (
                <tr key={characteristics.id}>
                  <td><input type="checkbox" /></td>
                  <td>{characteristics.id}</td>
                  <td>{characteristics.type}</td>
                  <td>{characteristics.description}</td>

                  <td className="actions">
                    <Link to={`/admin/characteristics/edit/${characteristics.id}`}><button className="edit-button">Edita</button></Link>
                    <button onClick={() => handleDelete(characteristics.id)} className="delete-button">Elimina</button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
export default Characteristics;