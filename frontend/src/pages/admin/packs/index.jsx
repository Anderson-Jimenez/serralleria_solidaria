import { Search, Plus, Pencil, Power } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Packs() {
  const [packs, setPacks] = useState([]);
  const [filteredPacks, setFilteredPacks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/packs")
      .then(response => response.json())
      .then(data => {
        setPacks(data);
        setFilteredPacks(data);

        // Extreure categories úniques dels packs
        const cats = data
          .map(p => p.category)
          .filter(Boolean)
          .filter((cat, i, arr) => arr.findIndex(c => c.id === cat.id) === i);
        setCategories(cats);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    let filtered = [...packs];

    if (search !== "") {
      filtered = filtered.filter(pack =>
        pack.name?.toLowerCase().includes(search.toLowerCase()) ||
        pack.code?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== "") {
      filtered = filtered.filter(pack =>
        pack.category && pack.category.id == selectedCategory
      );
    }

    setFilteredPacks(filtered);
  }, [search, selectedCategory, packs]);

  const changeStatusPack = (id) => {
    fetch(`http://localhost:8000/api/products/changeState/${id}`, {
      method: 'GET',
      headers: { "Content-Type": "application/json", "Accept": "application/json" }
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setPacks(prev => prev.map(item => item.id === id ? data.product : item));
        }
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Gestió de packs</h1>
      <h3 className="dashboard-subtitle">Administra els packs del catàleg</h3>

      <div className="caracteristics-content">
        <div className="table-container">
          <div className="tableFilters">
            <input
              type="text"
              placeholder="Cerca per nom o codi..."
              onChange={e => setSearch(e.target.value)}
            />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="">Totes les categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Link to="/admin/packs/create" className="add-button">
              <Plus size={18} /><span>Afegir pack</span>
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
              {filteredPacks.length > 0 ? filteredPacks.map(pack => (
                <tr key={pack.id}>
                  <td className="img">
                    {pack.primary_image
                      ? <img src={`http://localhost:8000/storage/${pack.primary_image.path}`} alt={pack.name} />
                      : "—"}
                  </td>
                  <td className="font-semibold">{pack.code}</td>
                  <td>{pack.name}</td>
                  <td>{pack.price}€</td>
                  <td><span className={pack.stock < 5 ? "text-danger" : ""}>{pack.stock} u.</span></td>
                  <td>{pack.category ? pack.category.name : "Sense categoria"}</td>
                  <td>
                    <span className={pack.status ? "status-active" : "status-inactive"}>
                      {pack.status ? "Actiu" : "Inactiu"}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <Link to={`/admin/packs/edit/${pack.id}`} className="action-icon edit" title="Editar">
                        <Pencil size={18} />
                      </Link>
                      <button className="action-icon power" onClick={() => changeStatusPack(pack.id)}>
                        <Power size={18} /> {pack.status ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                    No s'han trobat packs
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

export default Packs;