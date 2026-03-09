import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Categories() {

  const [categories, setCategories] = useState([]);

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
    
      <div className="table-container">
        <div className="space-between pb-10 mb-10 border-bottom">
          <div className="search-container">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Cerca Categories..." />
          </div>
          <Link to="/admin/categories/create"><button className="add-button">+ Afegeix Categoria</button></Link>
        </div>

        <table>
          <thead>
            <tr>
              <th>Codí</th>
              <th>Nom</th>
              <th>Descripció</th>
              <th>Estat</th>
              <th>Accions</th>
            </tr>
          </thead>
          <tbody>

            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.code}</td>

                <td>{category.name}</td>

                <td className="description">
                  {category.description ?? "-"}
                </td>

                <td>
                  <span className={category.status === 1 ? "status-active" : "status-inactive"}>{category.status === 1 ? "Actiu" : "Inactiu"}</span>
                </td>

                <td className="actions">
                  <Link to={`/admin/categories/edit/${category.id}`}><button className="edit-button">Edita</button></Link>
                  <button className="deactivate-button">Desactiva</button>
                  
                  <button className="delete-button" action={`/admin/categories/delete/${category.id}`}>Elimina</button>
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categories;