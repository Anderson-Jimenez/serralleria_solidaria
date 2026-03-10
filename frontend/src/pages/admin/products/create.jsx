import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductsCreate() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("general");

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
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                code,
                name,
                description,
                stock,
                highlighted_img: highlightedImg,
                price,
                discount,
                highlighted,
                category_id: categoryId,
                product_type: "simple"
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
            console.log('Producto creado:', data);
            navigate("/admin/products");
        })
        .catch(err => {
            console.error('Error detallado:', err);
        });
    };

    return (
        <div className="product-admin-container">
            <div className="admin-header">
                <h1 className="dashboard-title">Crear nou producte</h1>
                <button className="cancel-button" onClick={() => navigate("/admin/products")}>Cancelar</button>
            </div>

            <form onSubmit={handleSubmit} className="product-data-box">
                <div className="data-box-header">
                    <div className="title-section">
                        <h2>Datos del producto —</h2>

                        <select value="simple" readOnly>
                            <option value="simple">Producto simple</option>
                        </select>
                    </div>
                </div>

                <div className="data-box-body">
                    <nav className="data-sidebar">
                        <ul>
                            <li className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>
                                General
                            </li>
                            <li className={activeTab === 'inventario' ? 'active' : ''} onClick={() => setActiveTab('inventario')}>
                                Inventario
                            </li>
                            <li className={activeTab === 'avanzado' ? 'active' : ''} onClick={() => setActiveTab('avanzado')}>
                                Avanzado
                            </li>
                            <li className={activeTab === 'imagenes' ? 'active' : ''} onClick={() => setActiveTab('imagenes')}>
                                Imatges
                            </li>
                        </ul>
                    </nav>

                    <div className="data-content">
                        {activeTab === 'general' && (
                            <section className="tab-panel">
                                <div className="form-group">
                                    <label>Nom del producte</label>
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
                                    <label>Codi </label>
                                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Stock actual</label>
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
                    <button type="submit" className="save-button">Guardar Producte</button>
                </div>
            </form>
        </div>
    );
}

export default ProductsCreate;