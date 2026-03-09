import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CategoriesCreate(){

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(1);
    const [code, setCode] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:8000/api/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name,
                description,
                status,
                code
            })
        })
        .then(async res => {
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(JSON.stringify(errorData));
            }
            return res.json();
        })
        .then(data => {
            console.log('Categoría creada:', data);
            navigate("/admin/categories");
        })
        .catch(err => {
            console.error('Error detallado:', err);
            alert('Error al crear la categoría. Revisa la consola para más detalles.');
        });
    };

    return (
        <div className="edit-form">
            <h1 className="dashboard-title">Crear categoria</h1>
            <h3 className="dashboard-subtitle">Afegeix una nova categoria</h3>
            
            <form onSubmit={handleSubmit} className="flex-column">

                <div className="flex">
                    <div className="w50 flex-column">
                        <label htmlFor="name">Nom: </label>
                        <input  type="text" value={name} onChange={(e) => setName(e.target.value)}/> 
                    </div>

                    <div className="w50 flex-column">
                        <label htmlFor="status">Estat: </label>
                        <select value={status} onChange={(e) => setStatus(Number(e.target.value))} >
                            <option value="1">Actiu</option>
                            <option value="0">Inactiu</option>
                        </select>
                    </div>
                </div>

                <label htmlFor="code">Codi: </label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />

                <label htmlFor="description">Descripció: </label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>
                <input type="submit" value="Guardar" />

            </form>
        </div>
    );
}

export default CategoriesCreate;