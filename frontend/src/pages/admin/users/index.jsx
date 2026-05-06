import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, Power } from "lucide-react";

function Users() {

  const navigate = useNavigate();

  let [users, setUsers] = useState([]);

  const buscarUsuari = (e) => {
    let text = e.target.value;

    if(text===""){
      fetch("http://localhost:8000/api/users", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
      .then(response => response.json()) 
      .then(data => setUsers(data))
      .catch(error => console.error('Error en la petició:', error));
    }
    else{
      fetch(`http://localhost:8000/api/users/searchUsers/${text}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
      .then(response => response.json()) 
      .then(data => {
        if (data.success) {
          setUsers(data.users)
        } else {
          console.error('Error en la lògica del servidor:', data.message);
        }
      })
      .catch(error => console.error('Error en la petició:', error));
    }
  }

  useEffect(() => {
    fetch("http://localhost:8000/api/users")
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="dashboard-caracteristics">
      <h1 className="dashboard-title">Gestió d'usuaris</h1>
      <h3 className="dashboard-subtitle">Administra tots els usuaris</h3>

      <div className="caracteristics-content">
        <div className="table-container">

          <div className="tableFilters">
            <input type="text" name="" id="" placeholder="Buscar Usuaris..." onChange={buscarUsuari}/>

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