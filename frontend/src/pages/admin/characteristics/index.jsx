import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, Power } from "lucide-react";

function Characteristics() {

  const navigate = useNavigate();

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
    .then( e => {
      navigate("/admin/characteristics");
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
    .then( e => {
      navigate("/admin/characteristics");
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
                <th>ID</th>
                <th>Tipus</th>
                <th>Estat</th>
                <th>Accions</th>
              </tr>
            </thead>
            <tbody>
              {data.characteristicTypes.map((characteristicTypes) => (
                <tr key={characteristicTypes.id}>
                  <td>{characteristicTypes.id}</td>
                  <td>{characteristicTypes.type}</td>
                  <td>
                    <span className={characteristicTypes.status === 1 ? "status-active" : "status-inactive"}>
                      {characteristicTypes.status === 1 ? "Actiu" : "Inactiu"}
                    </span>
                  </td>

                  <td className="actions">
                    <Link className="action-icon edit" to={`/admin/characteristics/editType/${characteristicTypes.id}`}>
                      <Pencil size={18}/>
                    </Link>
                    <button className="action-icon power">
                      <Power size={18} className="mr-8"/> {characteristicTypes.status === 1 ? "Desactivar" : "Activar"}
                    </button>
                    <button className="action-icon delete" onClick={() => handleDeleteType(characteristicTypes.id)}>
                      <Trash2 size={18}/>
                    </button>
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
                <th>ID</th>
                <th>Descripció</th>
                <th>Tipus</th>
                <th>Estat</th>
                <th>Accions</th>
              </tr>
            </thead>
            <tbody>
              {data.characteristics.map((characteristics) => (
                <tr key={characteristics.id}>
                  <td>{characteristics.id}</td>
                  <td>{characteristics.description}</td>
                  <td>{characteristics.type.type}</td>
                  <td>
                    <span className={characteristics.status === 1 ? "status-active" : "status-inactive"}>
                      {characteristics.status === 1 ? "Actiu" : "Inactiu"}
                    </span>
                  </td>

                  <td className="actions">
                    <Link className="action-icon edit" to={`/admin/characteristics/editCharacteristic/${characteristics.id}`}>
                      <Pencil size={18}/>
                    </Link>
                    <button className="action-icon power">
                      <Power size={18} className="mr-8"/> {characteristics.status === 1 ? "Desactivar" : "Activar"}
                    </button>
                    <button className="action-icon delete" onClick={() => handleDeleteCharacteristic(characteristics.id)}>
                      <Trash2 size={18}/>
                    </button>
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