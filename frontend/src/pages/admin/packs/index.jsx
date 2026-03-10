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
                                <th><input type="checkbox" /></th>
                                <th>Codi</th>
                                <th>Nom</th>
                                <th>Descripció</th>
                                <th>Preu</th>
                                <th>Stock</th>
                                <th>Descompte</th>
                                <th>Resaltat</th>
                                <th>Categoria</th>
                                <th>Estat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packs.map((pack) => (
                                <tr key={pack.id}>
                                    <td><input type="checkbox" /></td>
                                    <td>{pack.code}</td>
                                    <td>{pack.name}</td>
                                    <td>{pack.description}</td>
                                    <td>{pack.price}</td>
                                    <td>{pack.stock}</td>
                                    <td>{pack.discount}</td>
                                    <td>{pack.highlighted}</td>
                                    <td>{pack.category_id}</td>
                                    <td><span className={pack.status === 1 ? "status-active" : "status-inactive"}>{pack.status === 1 ? "Actiu" : "Inactiu"}</span></td>
                                    


                                    <td className="actions">
                                        <Link to={`/admin/packs/edit/${pack.id}`}><button className="edit-button">Edita</button></Link>
                                        <Link ><button className="edit-button">Canviar Estat</button></Link>
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