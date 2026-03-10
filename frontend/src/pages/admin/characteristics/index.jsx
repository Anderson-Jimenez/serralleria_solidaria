import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Characteristics() {

  const [data, setData] = useState({ characteristics: [], characteristicTypes: [] });
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
      .then(data => setData(data))
      .catch(error => console.error(error));
  }, []);

  console.log(data);
  
  return (
    <div className="dashboard-content">
      <h1>Tipus</h1>
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
              {data.characteristicTypes.map((characteristicTypes) => (
                <tr key={characteristicTypes.id}>
                  <td><input type="checkbox" /></td>
                  <td>{characteristicTypes.id}</td>
                  <td>{characteristicTypes.type}</td>

                  <td className="actions">
                    <Link to={`/admin/characteristics/edit/${characteristicTypes.id}`}><button className="edit-button">Edita</button></Link>
                    <button onClick={() => handleDelete(characteristicTypes.id)} className="delete-button">Elimina</button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
              {data.characteristics.map((characteristics) => (
                <tr key={characteristics.id}>
                  <td><input type="checkbox" /></td>
                  <td>{characteristics.id}</td>
                  <td>{characteristics.description}</td>
                  <td>{characteristics.characteristics_type_id}</td>

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