import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CategoriesEdit(){

    const { id } = useParams();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(1);
    const [code, setCode] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        fetch(`http://localhost:8000/api/categories/${id}`)
        .then(res => res.json())
        .then(data => {
            setName(data.name);
            setDescription(data.description);
            setStatus(data.status);
            setCode(data.code);
        });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8000/api/categories/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                description,
                status,
                code
            })
        })
        .then(res => res.json())
        .then(() => {
            navigate("/admin/categories");
        })
        .catch(err => console.error(err));
    };

    return (
        <div className="edit-form">
            <h1 className="dashboard-title">Editar la categoria {name}</h1>
            <h3 className="dashboard-subtitle">Modifica les dades de la categoria "{name}"</h3>
            
            <form onSubmit={handleSubmit} className="flex-column">
                <div className="flex">
                    <div className="w50 flex-column">
                        <label htmlFor="name">Nom: </label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/> 
                    </div>
                    <div className="w50 flex-column">
                        <label htmlFor="status">Estat: </label>
                        <select value={status} onChange={(e) => setStatus(Number(e.target.value))}>
                            <option value="1">Actiu</option>
                            <option value="0">Inactiu</option>
                        </select>
                    </div>
                </div>

                <label htmlFor="description">Descripció: </label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>


                <input type="submit" value="Guardar" />
            </form>
        </div>
    );
}

export default CategoriesEdit;