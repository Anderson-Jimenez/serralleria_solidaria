import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Box, Settings, Image as ImageIcon, Save } from "lucide-react";

function ProductsCreate() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("general");

    // Estados
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState(0);
    const [highlightedImg, setHighlightedImg] = useState("");
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [highlighted, setHighlighted] = useState(0);
    const [categoryId, setCategoryId] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:8000/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
                code, name, description, stock,
                highlighted_img: highlightedImg,
                price, discount, highlighted,
                category_id: categoryId,
                product_type: "simple"
            })
        })
        .then(res => res.ok ? navigate("/admin/products") : null)
        .catch(err => console.error(err));
    };

    return (
        <div className="dashboard-content">
            <div className="space-between mb-10">
                <h1 className="dashboard-title">Crear nou producte</h1>
                <button className="action-icon" onClick={() => navigate("/admin/products")}>
                    <ArrowLeft size={18} />
                    <span>Tornar</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="product-data-box">
                <div className="data-box-header">
                    <div className="title-section">
                        <h2>Dades del producte</h2>
                        <select value="simple" readOnly>
                            <option value="simple">Producte simple</option>
                        </select>
                    </div>
                </div>

                <div className="data-box-body">
                    <nav className="data-sidebar">
                        <ul>
                            <li className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>
                                <Info size={18} /> <span className="text">General</span>
                            </li>
                            <li className={activeTab === 'inventario' ? 'active' : ''} onClick={() => setActiveTab('inventario')}>
                                <Box size={18} /> <span className="text">Inventari</span>
                            </li>
                            <li className={activeTab === 'avanzado' ? 'active' : ''} onClick={() => setActiveTab('avanzado')}>
                                <Settings size={18} /> <span className="text">Avançat</span>
                            </li>
                            <li className={activeTab === 'imagenes' ? 'active' : ''} onClick={() => setActiveTab('imagenes')}>
                                <ImageIcon size={18} /> <span className="text">Imatges</span>
                            </li>
                        </ul>
                    </nav>

                    <div className="data-content">
                        {activeTab === 'general' && (
                            <section className="tab-panel">
                                <div className="form-group">
                                    <label>Nom</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Preu (€)</label>
                                    <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Descompte (%)</label>
                                    <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Descripció</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />
                                </div>
                            </section>
                        )}

                        {activeTab === 'inventario' && (
                            <section className="tab-panel">
                                <div className="form-group">
                                    <label>Codi</label>
                                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                                </div>
                            </section>
                        )}

                        {activeTab === 'avanzado' && (
                            <section className="tab-panel">
                                <div className="form-group">
                                    <label>ID Categoria</label>
                                    <input type="number" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Destacat</label>
                                    <select value={highlighted} onChange={(e) => setHighlighted(Number(e.target.value))}>
                                        <option value="0">No</option>
                                        <option value="1">Sí</option>
                                    </select>
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                <div className="data-box-footer">
                    <button type="submit" className="save-button">
                        <Save size={18} />
                        <span>Guardar Producte</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductsCreate;