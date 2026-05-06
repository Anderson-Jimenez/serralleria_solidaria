import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, Power } from "lucide-react";

function Characteristics() {

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [id, setId] = useState("");

  const changeStatusCharacteristic = (id) => {
    fetch(`http://localhost:8000/api/characteristics/changeState/${id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }

    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setData(prevCharacteristics =>
            prevCharacteristics.map(item =>
              item.id === id ? data.characteristic : item
            )
          );
        } else {
          console.error('Error en la lògica del servidor:', data.message);
        }
      })
      .catch(error => console.error('Error en la petició:', error));      
  }

  const searchCharacteristic = (e) => {
    let text = e.target.value;

    if(text===""){
      fetch("http://localhost:8000/api/characteristics", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
      .then(response => response.json()) 
      .then(data => setData(data.characteristics))
      .catch(error => console.error('Error en la petició:', error));
    }
    else{
      fetch(`http://localhost:8000/api/characteristics/searchCharacteristic/${text}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
      .then(response => response.json()) 
      .then(data => {
        if (data.success) {
          setData(data.characteristics)
        } else {
          console.error('Error en la lògica del servidor:', data.message);
        }
      })
      .catch(error => console.error('Error en la petició:', error));
    }
  }

  /*
  const handleDeleteCharacteristic = (id) => {
    fetch(`http://localhost:8000/api/characteristics/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
      .then(e => {
        navigate("/admin/characteristics");
      })
  }
*/
  useEffect(() => {
    fetch("http://localhost:8000/api/characteristics")
      .then(response => response.json())
      .then(data => setData(data.characteristics))
      .catch(error => console.error(error));
  }, []);
  

  return (
    <div className="dashboard-caracteristics">
      <h1 className="dashboard-title">Gestió de Característiques</h1>
      <h3 className="dashboard-subtitle">Administra totes les característiques de la Serralleria</h3>

      <div className="caracteristics-content">
        <div className="table-container">

          <div className="tableFilters">
            <input type="text" name="" id="" placeholder="Buscar Caracteristiques..." onChange={searchCharacteristic}/>

            <select name="" id="">

            </select>

            <Link to="/admin/characteristics/create">Afegir Caracteristica +</Link>

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
              {data.map((characteristics) => (
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
                    <Link className="action-icon edit" to={`/admin/characteristics/edit/${characteristics.id}`}>
                      <Pencil size={18} />
                    </Link>
                    <button className="action-icon power" onClick={() => changeStatusCharacteristic(characteristics.id)}>
                      <Power size={18} color={characteristics.status === 1 ? "green" : "red"}/>  {characteristics.status === 1 ? "Desactivar" : "Activar"}
                    </button>
                    {/*
                    <button className="action-icon delete" onClick={() => handleDeleteCharacteristic(characteristics.id)}>
                      <Trash2 size={18} />
                    </button>
                    */}
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