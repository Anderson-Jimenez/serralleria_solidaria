import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Power, Trash2, FileText  } from "lucide-react";

function OrderIndex() {

  const navigate = useNavigate();
  const [orders, setOrders] = useState([]); 

  console.log(orders);

  const searchOrders = (e) => {
    let text = e.target.value;

    if(text===""){
      fetch("http://localhost:8000/api/orders", {
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
    fetch(`http://localhost:8000/api/orders`)
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(error => console.error(error));

  }, []);

  return (
    <div className="dashboard-content">

      <h1 className="dashboard-title">Gestió de comandes</h1>
      <h3 className="dashboard-subtitle">Administra les comandes</h3>

      <div className="caracteristics-content">
        <div className="table-container">

          <div className="tableFilters">
            <input
              type="text"
              placeholder="Cerca per nom, codi o descripció..."
            /*onChange={searchOrders}*/
            />

            <select
            /*value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}*/
            >
              <option value="">Totes les categories</option>

              {/*categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))*/}

            </select>
          </div>

          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Direcció</th>
                <th>Observacions</th>
                <th>Preu</th>
                <th>Estat</th>
                <th className="text-center">Accions</th>
              </tr>
            </thead>

            <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.user.username}</td>
                      <td>Res de direccio de moment</td>
                      <td>{order.observations}</td>
                      <td>{order.total_price}€</td>
                      <td>{order.status}</td>
                      <td><a className="action-icon" href={`/orders/pdf/${order.id}`}><FileText size={20}/></a></td>
                  </tr>
                ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}

export default OrderIndex;