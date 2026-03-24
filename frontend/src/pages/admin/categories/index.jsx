import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, Power } from "lucide-react";

function Categories() {

  const [categories, setCategories] = useState([]);


  const searchCategories = (e) => {
    let text = e.target.value;

    if(text===""){
      fetch("http://localhost:8000/api/categories", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
      .then(response => response.json()) 
      .then(data => {
        setCategories(data.categories);
      })
      .catch(error => console.error('Error en la petició:', error));
    }
    else{
      fetch(`http://localhost:8000/api/categories/searchCategories/${text}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
      .then(response => response.json()) 
      .then(data => {
        if (data.success) {
          setCategories(data.categories);
        } else {
          console.error('Error en la lògica del servidor:', data.message);
        }
      })
      .catch(error => console.error('Error en la petició:', error));
    }
  }

  useEffect(() => {
    fetch("http://localhost:8000/api/categories")
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="dashboard-content">

      <h1 className="dashboard-title">Gestió de Categories</h1>
      <h3 className="dashboard-subtitle">Administra les categories d'un producte</h3>

      <div className="caracteristics-content">
        <div className="table-container">

          <div className="tableFilters">
            <input
                type="text"
                placeholder="Cerca per nom, codi o descripció..."
                onChange={searchCategories}
              />

            <select>
              <option value="">Tots els estats</option>
              <option value="1">Actiu</option>
              <option value="0">Inactiu</option>
            </select>

            <Link to="/admin/categories/create" className="add-button">
              <Plus size={18}/>
              <span>Afegir categoria</span>
            </Link>

          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Descripció</th>
                <th>Estat</th>
                <th>Accions</th>
              </tr>
            </thead>

            <tbody>

              {categories.map((category) => (
                <tr key={category.id}>

                  <td>{category.id}</td>

                  <td>{category.name}</td>

                  <td className="description">
                    {category.description ?? "-"}
                  </td>

                  <td>
                    <span className={category.status === 1 ? "status-active" : "status-inactive"}>
                      {category.status === 1 ? "Actiu" : "Inactiu"}
                    </span>
                  </td>

                  <td className="actions">

                    <Link
                      to={`/admin/categories/edit/${category.id}`}
                      className="action-icon edit"
                    >
                      <Pencil size={18}/>
                    </Link>

                    <button className="action-icon power">
                      <Power size={18} className="mr-8"/> {category.status === 1 ? "Desactivar" : "Activar"}
                    </button>

                    <button className="action-icon delete">
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

export default Categories;