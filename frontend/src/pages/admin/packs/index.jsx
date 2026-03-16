import { Eye, Pencil, Power } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Packs() {

    const [packs, setPacks] = useState([]);
    const [id, setId] = useState("");

    useEffect(() => {
        fetch("http://localhost:8000/api/packs")
            .then(response => response.json())
            .then(data => setPacks(data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="dashboard-content">
            <h1>Packs</h1>
            <div className="caracteristics-content">
                <div className="table-container">
                    <div className="tableFilters">
                        <input type="text" name="" id="" placeholder="Buscar Packs..." />

                        <select name="" id="">

                        </select>

                        <Link to="/admin/packs/create">Afegir Pack +</Link>

                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Codi</th>
                                <th>Nom</th>
                                <th>Descripció</th>
                                <th>Preu</th>
                                <th>Stock</th>
                                <th>Descompte</th>
                                <th>Resaltat</th>
                                <th>Categoria</th>
                                <th>Estat</th>
                                <th>Accions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packs.map((pack) => (
                                <tr key={pack.id}>
                                    <td>{pack.code}</td>
                                    <td>{pack.name}</td>
                                    <td>{pack.description}</td>
                                    <td>{pack.price}</td>
                                    <td>{pack.stock}</td>
                                    <td>{pack.discount}</td>
                                    <td>{pack.highlighted === 0 ? "No" : "Si"}</td>
                                    <td>{pack.category_id}</td>
                                    <td><span className={pack.status === 1 ? "status-active" : "status-inactive"}>{pack.status === 1 ? "Actiu" : "Inactiu"}</span></td>
                                    


                                    <td className="actions">
                                        <Link 
                                            className="action-icon" 
                                            title="Veure"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <button className="action-icon power">
                                            <Power size={18} className="mr-8"/> {pack.status === 1 ? "Desactivar" : "Activar"}
                                        </button>
                                        <Link className="action-icon edit" to={`/admin/packs/edit/${pack.id}`}>
                                            <Pencil size={18}/>
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
export default Packs;