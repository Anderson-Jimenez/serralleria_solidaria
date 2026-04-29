import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Power, Trash2 } from "lucide-react";

function OrderIndex() {

  const navigate = useNavigate();
  const [orders, setOrders] = useState([]); 

  console.log(orders);

  const openOrder = (order) => {
    navigate(`/admin/orders/${order.id}`);
  };

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
            /*onChange={searchProducts}*/
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
                <th>Data entrega</th>
                <th>Preu</th>
                <th>Estat</th>
                <th className="text-center">Accions</th>
              </tr>
            </thead>

            <tbody>
                {orders.map(order => (
                  <tr>
                      <td>{order.id}</td>
                      <td>{order.user.username}</td>
                      <td>{order.observations}</td>
                      <td>{order.total_price}€</td>
                      <td>{order.status}</td>
                      <td><button onClick={openOrder(order)}>Veure Albaran</button></td>
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