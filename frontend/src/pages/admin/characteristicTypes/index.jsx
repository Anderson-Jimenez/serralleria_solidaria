import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, Power } from "lucide-react";

function Characteristics() {

  const navigate = useNavigate();

  let [data, setData] = useState([]);
  let [id, setId] = useState("");

  console.log(data);

  const changeStatusTypeCharacteristic = (id) => {
    fetch(`http://localhost:8000/api/characteristicTypes/changeState/${id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
      .then(response => response.json()) 
      .then(data => {
        if (data.success) {
          setData(prevType =>
            prevType.map(characteristicType =>
              characteristicType.id === id ? data.type : characteristicType
            )
          );
        } else {
          console.error('Error en la lògica del servidor:', data.message);
        }
      })
      .catch(error => console.error('Error en la petició:', error));
  }

  const buscarTipus = (e) => {
    let text = e.target.value;

    if(text===""){
      fetch("http://localhost:8000/api/characteristicTypes", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
      .then(response => response.json()) 
      .then(data => setData(data))
      .catch(error => console.error('Error en la petició:', error));
    }
    else{
      fetch(`http://localhost:8000/api/characteristicTypes/searchTypeCharacteristic/${text}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
      .then(response => response.json()) 
      .then(data => {
        if (data.success) {
          setData(data.types)
        } else {
          console.error('Error en la lògica del servidor:', data.message);
        }
      })
      .catch(error => console.error('Error en la petició:', error));
    }
  }

  {/*
  const handleDeleteType = (id) => {
    fetch(`http://localhost:8000/api/characteristicTypes/${id}`, {
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
  */}

  useEffect(() => {
    fetch("http://localhost:8000/api/characteristic-types")
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="dashboard-caracteristics">
      <div className="caracteristics-content">
        <div className="table-container">
          <h1>Tipus de Caracteristiques</h1>
          <div className="tableFilters">
            <input type="text" name="" id="" placeholder="Buscar Tipus de Caracteristiques..." onChange={buscarTipus}/>

            <select name="" id="">

            </select>

            <Link to="/admin/types/create">Afegir Tipus +</Link>

          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipus</th>
                <th>Tipus de Filtre</th>
                <th>Estat</th>
                <th>Accions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((characteristicTypes) => (
                <tr key={characteristicTypes.id}>
                  <td>{characteristicTypes.id}</td>
                  <td>{characteristicTypes.type}</td>
                  <td>{characteristicTypes.filterType}</td>
                  <td>
                    <span className={characteristicTypes.status === 1 ? "status-active" : "status-inactive"}>
                      {characteristicTypes.status === 1 ? "Actiu" : "Inactiu"}
                    </span>
                  </td>
                  <td className="actions">
                    <Link className="action-icon edit" to={`/admin/types/edit/${characteristicTypes.id}`}>
                      <Pencil size={18} />
                    </Link>
                    <button className="action-icon power" onClick={() => changeStatusTypeCharacteristic(characteristicTypes.id)}>
                      <Power size={18} color={characteristicTypes.status === 1 ? "green" : "red"} /> {characteristicTypes.status === 1 ? "Desactivar" : "Activar"}
                    </button>
                    {/*
                    <button className="action-icon delete" onClick={() => handleDeleteType(characteristicTypes.id)}>
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