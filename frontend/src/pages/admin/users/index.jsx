import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, Power } from "lucide-react";

function Users() {

  const navigate = useNavigate();

  let [users, setUsers] = useState([]);


  useEffect(() => {
    fetch("http://localhost:8000/api/users")
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="dashboard-caracteristics">
      <div className="caracteristics-content">
        <div className="table-container">
          <h1>Usuaris</h1>
          <div className="tableFilters">
            <input type="text" name="" id="" placeholder="Buscar Usuaris..."/>

            <select name="" id="">

            </select>

            <Link to="/admin/users/create">Afegir Usuari +</Link>

          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Telèfon</th>
                <th>Tipus d'Usuari</th>
                <th>Accions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.userType}</td>
                  <td className="actions">
                    <Link className="action-icon edit" to={`/admin/users/edit/${user.id}`}>
                      <Pencil size={18} />
                    </Link>
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

export default Users;