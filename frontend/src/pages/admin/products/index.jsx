import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Eye, Trash2 } from "lucide-react";

function ProductsIndex() {
  const [products, setProducts] = useState([]);
  const [data, setData] = useState({ characteristics: [], categories: [] });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:8000/api/products")
      .then(response => response.json())
      .then(res => {
        setProducts(res.products);
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Gestió de Productes</h1>
      <h3 className="dashboard-subtitle">Administra els productes del catàleg</h3>
    
      <div className="caracteristics-content">
        <div className="table-container">
          
          <div className="tableFilters">
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Cerca per nom, codi o descripció..." />
            </div>

            <select>
              <option value="">Totes les categories</option>
            </select>

            <Link to="/admin/products/create" className="add-button">
              <Plus size={18} />
              <span>Afegir producte</span>
            </Link>
          </div>

          <table>
            <thead>
              <tr>
                <th>Codi</th>
                <th>Nom</th>
                <th>Descripció</th>
                <th>Preu</th>
                <th>Stock</th>
                <th>Categoria</th>
                <th>Estat</th>
                <th className="text-center">Accions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="font-semibold">{product.code}</td>
                    <td>{product.name}</td>
                    <td className="description">
                      {product.description ?? "-"}
                    </td>
                    <td>{product.price}€</td>
                    <td>
                      <span className={product.stock < 5 ? "text-danger" : ""}>
                        {product.stock} u.
                      </span>
                    </td>
                    <td>{product.categories[0]?.name ?? "Sin categoría"}</td>
                    <td>
                      <span className={product.status === 1 ? "status-active" : "status-inactive"}>
                        {product.status === 1 ? "Actiu" : "Inactiu"}
                      </span>
                    </td>
                    <td className="actions">
                      <Link 
                        to={`/admin/products/view/${product.id}`} 
                        className="action-icon" 
                        title="Veure"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link 
                        to={`/admin/products/edit/${product.id}`} 
                        className="action-icon edit" 
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button 
                        className="action-icon delete" 
                        title="Eliminar"
                        onClick={() => {/* Tu lógica de delete */}}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                    No s'han trobat productes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductsIndex;