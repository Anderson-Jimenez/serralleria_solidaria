import { Search, Plus, Pencil, Power, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Packs() {

    const [packs, setPacks] = useState([]);
    const [id, setId] = useState("");

    useEffect(() => {
        fetch("http://localhost:8000/api/packs")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setPacks(data);
            })
            .catch(error => console.error(error));
    }, []);

    return (

        <div className="dashboard-content">

            <h1 className="dashboard-title">Gestió de packs</h1>
            <h3 className="dashboard-subtitle">Administra els packs del catàleg</h3>

            <div className="caracteristics-content">
                <div className="table-container">

                    <div className="tableFilters">
                        <input
                            type="text"
                            placeholder="Cerca per nom, codi o descripció..."
                            /*onChange={searchPacks}*/
                        />

                        <select>

                        </select>


                        <Link to="/admin/packs/create" className="add-button">
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

                            {packs.length > 0 ? (

                                packs.map(pack => (

                                    <tr key={pack.id}>
                                        <td className="img">
                                            {pack.primaryImage ? (
                                                <img
                                                    src={`http://localhost:8000/storage/${pack.primaryImage.path}`}
                                                    alt={pack.name}
                                                />
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                        <td className="font-semibold">{pack.code}</td>

                                        <td>{pack.name}</td>

                                        <td>{pack.price}€</td>

                                        <td>
                                            <span className={pack.stock < 5 ? "text-danger" : ""}>
                                                {pack.stock} u.
                                            </span>
                                        </td>

                                        <td>
                                            {pack.category ? pack.category.name : "Sense categoria"}
                                        </td>

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
                                                <button className="action-icon power">
                                                    <Power size={18} className="mr-8" /> {pack.status ? "Desactivar" : "Activar"}
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
export default Packs;