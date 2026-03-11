import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

function Characteristics() {
  const [characteristics, setCharacteristics] = useState([]);

  // Cargar datos
  useEffect(() => {
    fetch("http://localhost:8000/api/characteristics")
      .then(response => response.json())
      .then(data => setCharacteristics(data))
      .catch(error => console.error(error));
  }, []);

  // Función de borrado con actualización de estado local
  const handleDelete = (id) => {
    if (window.confirm("Estàs segur que vols eliminar aquesta característica?")) {
      fetch(`http://localhost:8000/api/characteristics/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
      .then(() => {
        // Filtramos el array para quitar la que acabamos de borrar
        setCharacteristics(characteristics.filter(item => item.id !== id));
      })
      .catch(error => console.error("Error al eliminar:", error));
    }
  };

  return (
    <div className="dashboard-content">
      {/* Títulos con las mismas clases que Categories */}
      <h1 className="dashboard-title">Característiques</h1>
      <h3 className="dashboard-subtitle">Administra los atributos técnicos de los productos</h3>

      <div className="caracteristics-content">
        <div className="table-container">
          
          <div className="tableFilters">
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Cerca característiques..." />
            </div>

            <select>
              <option value="">Tots els tipus</option>
              {/* Aquí podrías mapear tipos únicos si los tienes */}
            </select>

            <Link to="/admin/characteristics/create" className="add-button">
              <Plus size={18} />
              <span>Afegir característica</span>
            </Link>
          </div>

          <table>
            <thead>
              <tr>
                <th style={{ width: "40px" }}><input type="checkbox" /></th>
                <th>ID</th>
                <th>Tipus</th>
                <th>Descripció</th>
                <th className="text-center">Accions</th>
              </tr>
            </thead>
            <tbody>
              {characteristics.map((item) => (
                <tr key={item.id}>
                  <td><input type="checkbox" /></td>
                  <td>{item.id}</td>
                  <td className="font-semibold">{item.type}</td>
                  <td className="description">
                    {item.description || "-"}
                  </td>
                  <td className="actions">
                    <Link 
                      to={`/admin/characteristics/edit/${item.id}`} 
                      className="action-icon edit"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </Link>
                    
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="action-icon delete"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
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