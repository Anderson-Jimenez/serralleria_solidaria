import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Box, Settings, Image as ImageIcon, Save } from "lucide-react";

function CategoriesCreate() {

    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("general");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(1);

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
        <div className="dashboard-content" role="main" aria-labelledby="create-category-title">
            <h1 className="dashboard-title" id="create-category-title">Crear categoria</h1>
            <h3 className="dashboard-subtitle">Afegeix una nova categoria</h3>

            <form onSubmit={handleSubmit} className="product-data-box" aria-labelledby="create-category-title">
                <div className="data-box-header">
                    <div className="title-section">
                        <h2>Dades de la caracteristica</h2>
                    </div>
                </div>

                <div className="data-box-body">
                    <nav className="data-sidebar" aria-label="Seccions del formulari">
                        <ul role="tablist" aria-label="Pestanyes del formulari">
                            <li 
                                className={activeTab === 'general' ? 'active' : ''} 
                                onClick={() => setActiveTab('general')}
                                role="tab"
                                tabIndex={activeTab === 'general' ? 0 : -1}
                                aria-selected={activeTab === 'general'}
                                aria-controls="general-panel"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveTab('general');
                                    }
                                }}
                            >
                                <Info size={18} aria-hidden="true" /> <span className="text">General</span>
                            </li>
                        </ul>
                    </nav>

                    <div className="data-content">
                        {activeTab === 'general' && (
                            <section 
                                className="tab-panel" 
                                id="general-panel"
                                role="tabpanel"
                                aria-labelledby="general-tab"
                            >
                                <div className="form-group">
                                    <label htmlFor="category-name">Nom: </label>
                                    <input 
                                        id="category-name"
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        aria-required="true"
                                        aria-label="Nom de la categoria"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="category-status">Estat: </label>
                                    <select 
                                        id="category-status"
                                        value={status} 
                                        onChange={(e) => setStatus(Number(e.target.value))}
                                        aria-label="Estat de la categoria"
                                    >
                                        <option value="1">Actiu</option>
                                        <option value="0">Inactiu</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="category-description">Descripció</label>
                                    <textarea 
                                        id="category-description"
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)} 
                                        rows="4"
                                        aria-label="Descripció de la categoria"
                                    />
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                <div className="data-box-footer">
                    <button 
                        type="submit" 
                        className="save-button"
                        aria-label="Guardar categoria"
                    >
                        <Save size={18} aria-hidden="true" />
                        <span>Guardar Categoria</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CategoriesCreate;