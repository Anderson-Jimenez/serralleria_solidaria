import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Characteristics() {

  const [data, setData] = useState({ characteristics: [], characteristicTypes: [] });
  const [id, setId] = useState("");

  const handleDeleteCharacteristic = (id) => {
    fetch(`http://localhost:8000/api/characteristics/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
  }

  const handleDeleteType = (id) => {
    fetch(`http://localhost:8000/api/characteristicTypes/${id}`, {
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
    <div className="dashboard-caracteristics">
      <div className="caracteristics-content">
        <div className="table-container">
          <h1>Tipus</h1>
          <div className="tableFilters">
            <input type="text" name="" id="" placeholder="Buscar Caracteristiques..." />

            <select name="" id="">

            </select>

            <Link to="/admin/characteristics/createType">Afegir Tipus +</Link>

          </div>
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>ID</th>
                <th>Tipus</th>
              </tr>
            </thead>
            <tbody>
              {data.characteristicTypes.map((characteristicTypes) => (
                <tr key={characteristicTypes.id}>
                  <td><input type="checkbox" /></td>
                  <td>{characteristicTypes.id}</td>
                  <td>{characteristicTypes.type}</td>

                  <td className="actions">
                    <Link to={`/admin/characteristics/editType/${characteristicTypes.id}`}><button className="edit-button">Edita</button></Link>
                    <button onClick={() => handleDeleteType(characteristicTypes.id)} className="delete-button">Elimina</button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <div className="caracteristics-content">
        <div className="table-container">
          <h1>Caracteristiques</h1>

          <div className="tableFilters">
            <input type="text" name="" id="" placeholder="Buscar Caracteristiques..." />

            <select name="" id="">

            </select>

            <Link to="/admin/characteristics/createCharacteristic">Afegir Caracteristica +</Link>

          </div>
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>ID</th>
                <th>Descripció</th>
                <th>Tipus</th>
              </tr>
            </thead>
            <tbody>
              {data.characteristics.map((characteristics) => (
                <tr key={characteristics.id}>
                  <td><input type="checkbox" /></td>
                  <td>{characteristics.id}</td>
                  <td>{characteristics.description}</td>
                  <td>{characteristics.type.type}</td>

                  <td className="actions">
                    <Link to={`/admin/characteristics/editCharacteristic/${characteristics.id}`}><button className="edit-button">Edita</button></Link>
                    <button onClick={() => handleDeleteCharacteristic(characteristics.id)} className="delete-button">Elimina</button>
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