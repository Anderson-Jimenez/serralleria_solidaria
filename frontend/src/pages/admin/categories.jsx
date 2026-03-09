import { useEffect, useState } from "react";

function Categories() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="dashboard-content table-container">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox"/></th>
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

              <td><input type="checkbox"/></td>

              <td>{category.id}</td>

              <td>{category.name}</td>

              <td className="description">
                {category.description ?? "-"}
              </td>

              <td>
                {category.status === 1 ? "Actiu" : "Inactiu"}
              </td>

              <td className="actions">
                <button className="edit-button">Edita</button>
                <button className="deactivate-button">Desactiva</button>
                <button className="delete-button">Elimina</button>
              </td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}

export default Categories;