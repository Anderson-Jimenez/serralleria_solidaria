import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Box, Settings, Image as ImageIcon, Save } from "lucide-react";

function CategoriesEdit(){

    const { id } = useParams();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(1);
    const [code, setCode] = useState("");

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("general");

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
        <div className="dashboard-content">
            <h1 className="dashboard-title">Editar categoria</h1>
            <h3 className="dashboard-subtitle">Editar una categoria</h3>

            <form onSubmit={handleSubmit} className="product-data-box">
                <div className="data-box-header">
                    <div className="title-section">
                        <h2>Dades de la caracteristica</h2>
                    </div>
                </div>

                <div className="data-box-body">
                    <nav className="data-sidebar">
                        <ul>
                            <li className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>
                                <Info size={18} /> <span className="text">General</span>
                            </li>
                        </ul>
                    </nav>



                    <div className="data-content">
                        {activeTab === 'general' && (
                            <section className="tab-panel">
                                <div className="form-group">
                                    <label htmlFor="name">Nom: </label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Estat: </label>
                                    <select value={status} onChange={(e) => setStatus(Number(e.target.value))} >
                                        <option value="1">Actiu</option>
                                        <option value="0">Inactiu</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Descripció</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />
                                </div>
                            </section>
                        )}

                    </div>
                </div>

                <div className="data-box-footer">
                    <button type="submit" className="save-button">
                        <Save size={18} />
                        <span>Actualitzar Categoria</span>
                    </button>
                </div>
            </form>


        </div>
    );
}

export default CategoriesEdit;