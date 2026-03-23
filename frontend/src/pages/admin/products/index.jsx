import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Power, Trash2 } from "lucide-react";

function ProductsIndex() {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [search, selectedCategory, products]);

  const fetchProducts = () => {
    fetch("http://localhost:8000/api/products")
      .then(response => response.json())
      .then(res => {
        setProducts(res.products);
        setFilteredProducts(res.products);
        setCategories(res.categories);
      })
      .catch(error => console.error(error));
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (search !== "") {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.code?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== "") {
      filtered = filtered.filter(product =>
        product.category && product.category.id == selectedCategory
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="dashboard-content">

      <h1 className="dashboard-title">Gestió de productes</h1>
      <h3 className="dashboard-subtitle">Administra els productes del catàleg</h3>

      <div className="caracteristics-content">
        <div className="table-container">

          <div className="tableFilters">

            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Cerca per nom, codi o descripció..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Totes les categories</option>

              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}

            </select>

            <Link to="/admin/products/create" className="add-button">
              <Plus size={18} />
              <span>Afegir producte</span>
            </Link>

          </div>

          <table>

            <thead>
              <tr>
                <th>Imatge</th>
                <th>Codi</th>
                <th>Nom</th>
                <th>Preu</th>
                <th>Estoc</th>
                <th>Categoria</th>
                <th>Estat</th>
                <th className="text-center">Accions</th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.length > 0 ? (

                filteredProducts.map(product => (

                  <tr key={product.id}>
                    <td className="img">
                      {product.primary_image ? (
                        <img
                          src={`http://localhost:8000/storage/${product.primary_image.path}`}
                          alt={product.name}
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="font-semibold">{product.code}</td>

                    <td>{product.name}</td>

                    <td>{product.sale_price}€</td>

                    <td>
                      <span className={product.stock < 5 ? "text-danger" : ""}>
                        {product.stock} u.
                      </span>
                    </td>

                  <td>
                    {product.category ? product.category.name : "Sense categoria"}
                  </td>

                    <td>
                      <span className={product.status === 1 ? "status-active" : "status-inactive"}>
                        {product.status === 1 ? "Actiu" : "Inactiu"}
                      </span>
                    </td>

                    <td>
                      <div className="actions">
                        <Link to={`/admin/products/edit/${product.id}`} className="action-icon edit" title="Editar">
                          <Pencil size={18} />
                        </Link>
                        <button className="action-icon power">
                          <Power size={18} className="mr-8" /> {product.status === 1 ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          className="action-icon delete"
                          title="Eliminar"
                          onClick={() => {
                            if (window.confirm("Segur que vols eliminar aquest producte?")) {
                              console.log("Eliminar producte", product.id);
                            }
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
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