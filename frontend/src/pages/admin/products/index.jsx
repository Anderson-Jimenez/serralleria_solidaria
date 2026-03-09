import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProductsIndex() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:8000/api/products")
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  };




  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Gestió de Productes</h1>
      <h3 className="dashboard-subtitle">Administra els productes del catàleg</h3>
    
      <div className="table-container">
        <div className="space-between pb-10 mb-10 border-bottom">
          <div className="search-container">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text"  placeholder="Cerca productes per nom, codi o descripció..." />
          </div>
          <Link to="/admin/products/create">
            <button className="add-button">+ Afegeix Producte</button>
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
              <th>Tipus</th>
              <th>Estat</th>
              <th>Accions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.code}</td>
                  <td>{product.name}</td>
                  <td className="description">
                    {product.description ? 
                      (product.description.length > 50 ? 
                        product.description.substring(0, 50) + '...' : 
                        product.description) 
                      : "-"}
                  </td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.category_id}</td>
                  <td>
                    <span className={`badge`}>
                      {product.product_type}
                    </span>
                  </td>
                  <td>
                    <span className={product.status === 1 ? "status-active" : "status-inactive"}>
                      {product.status === 1 ? "Actiu" : "Inactiu"}
                    </span>
                  </td>
                  <td className="actions">
                    <Link to={`/admin/products/view/${product.id}`}>
                      <button className="view-button">Veure</button>
                    </Link>
                    <Link to={`/admin/products/edit/${product.id}`}>
                      <button className="edit-button">Edita</button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                  No s'han trobat productes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsIndex;