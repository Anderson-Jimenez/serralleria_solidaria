import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ArrowLeft, Info, Box, Settings, Image as ImageIcon, 
    Save, LayoutList, X, Upload, Star, CheckCircle, AlertCircle
} from "lucide-react";

function ProductsCreate() {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });

    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [discountStartsAt, setDiscountStartsAt] = useState("");
    const [discountEndsAt, setDiscountEndsAt] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [stock, setStock] = useState(0);

    const [weight, setStock] = useState(0);

    const [intSize, setIntSize] = useState("");
    const [extSize, setExtSize] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [highlighted, setHighlighted] = useState(0);

    const [selectedCharacteristics, setSelectedCharacteristics] = useState({});
    const [extraValues, setExtraValues] = useState({});

    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

    useEffect(() => {
        fetch("http://localhost:8000/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data.categories ?? data));

        fetch("http://localhost:8000/api/characteristic-types")
            .then(res => res.json())
            .then(data => setTypes(data));
    }, []);

    useEffect(() => {
        if (alert.show) {
            const timer = setTimeout(() => setAlert({ ...alert, show: false }), 4000);
            return () => clearTimeout(timer);
        }
    }, [alert.show]);

    const handleCharacteristicChange = (typeId, value) => {
        setSelectedCharacteristics(prev => ({ ...prev, [typeId]: value }));
    };

    const handleExtraValueChange = (typeId, field, value) => {
        setExtraValues(prev => ({
            ...prev,
            [typeId]: { ...prev[typeId], [field]: value }
        }));
    };

    const handleFiles = (files) => {
        const filesArray = Array.from(files);
        setImages(prev => [...prev, ...filesArray]);
        const urls = filesArray.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...urls]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
        if (primaryImageIndex >= images.length - 1) setPrimaryImageIndex(0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("code", code);
        formData.append("name", name);
        formData.append("description", description || "");
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("discount_percentage", discountPercentage);
        formData.append("discount_starts_at", discountStartsAt);
        formData.append("discount_ends_at", discountEndsAt);
        formData.append("int_size", intSize);
        formData.append("ext_size", extSize);
        formData.append("highlighted", highlighted ? 1 : 0);
        formData.append("category_id", categoryId);
        formData.append("product_type", "simple");
        formData.append("primary_image_index", primaryImageIndex);

        let charIndex = 0;

        for (let typeId in selectedCharacteristics) {
            const type = types.find(t => t.id == typeId);
            const val = selectedCharacteristics[typeId];

            if (type?.type === "Pes" && val !== "" && val !== null) {
                formData.append(`characteristic[${charIndex}][type_id]`, typeId);
                formData.append(`characteristic[${charIndex}][value]`, val);
                formData.append(`characteristic[${charIndex}][is_value]`, 1);
                charIndex++;
            } else if (type?.type === "Duplicat de clau" && extraValues[typeId]?.enabled) {
                const siChar = type.characteristics?.find(c => c.description === "Si");
                if (siChar) {
                    formData.append(`characteristic[${charIndex}][type_id]`, typeId);
                    formData.append(`characteristic[${charIndex}][value]`, siChar.id);
                    formData.append(`characteristic[${charIndex}][extra_value]`, extraValues[typeId]?.price ?? 0);
                    formData.append(`characteristic[${charIndex}][is_value]`, 0);
                    charIndex++;
                }
            } else if (type?.type === "Doble Embrague") {
                const siChar = type.characteristics?.find(c => c.description === (val ? "Si" : "No"));
                if (siChar) {
                    formData.append(`characteristic[${charIndex}][type_id]`, typeId);
                    formData.append(`characteristic[${charIndex}][value]`, siChar.id);
                    formData.append(`characteristic[${charIndex}][is_value]`, 0);
                    charIndex++;
                }
            } else if (val !== "" && val !== null && val !== false) {
                formData.append(`characteristic[${charIndex}][type_id]`, typeId);
                formData.append(`characteristic[${charIndex}][value]`, val);
                formData.append(`characteristic[${charIndex}][is_value]`, 0);
                charIndex++;
            }
        }

        images.forEach((file) => formData.append("images[]", file));

        fetch("http://localhost:8000/api/products", {
            method: "POST",
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setAlert({ show: true, type: "success", message: "Producte Pujat correctament" });
                setTimeout(() => navigate("/admin/products"), 2000);
            } else {
                setAlert({ show: true, type: "error", message: "Error en pujar un producte" });
            }
        })
        .catch(() => setAlert({ show: true, type: "error", message: "Error de conexió amb el servidor" }));
    };

    return (
        <div className="dashboard-content">
            {alert.show && (
                <div className={`alert-toast ${alert.type}`}>
                    {alert.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <p>{alert.message}</p>
                    <X size={16} className="close-alert" onClick={() => setAlert({ ...alert, show: false })} />
                </div>
            )}

            <div className="space-between mb-10">
                <h1 className="dashboard-title">Crear nou producte</h1>
                <button type="button" className="action-icon" onClick={() => navigate("/admin/products")}>
                    <ArrowLeft size={18} /> Tornar
                </button>
            </div>

            <form onSubmit={handleSubmit} className="product-data-box">
                <div className="data-box-header">
                    <div className="title-section">
                        <h2>Dades del producte</h2>
                        <select disabled><option>Producte simple</option></select>
                    </div>
                </div>

                <div className="data-box-body">
                    <nav className="data-sidebar">
                        <ul>
                            <li className={activeTab === "general" ? "active" : ""} onClick={() => setActiveTab("general")}><Info size={18} /> <span>General</span></li>
                            <li className={activeTab === "inventario" ? "active" : ""} onClick={() => setActiveTab("inventario")}><Box size={18} /> <span>Inventari</span></li>
                            <li className={activeTab === "avanzado" ? "active" : ""} onClick={() => setActiveTab("avanzado")}><Settings size={18} /> <span>Avançat</span></li>
                            <li className={activeTab === "caracteristics" ? "active" : ""} onClick={() => setActiveTab("caracteristics")}><LayoutList size={18} /> <span>Característiques</span></li>
                            <li className={activeTab === "imagenes" ? "active" : ""} onClick={() => setActiveTab("imagenes")}><ImageIcon size={18} /> <span>Imatges</span></li>
                        </ul>
                    </nav>

                    <div className="data-content flex">
                        {activeTab === "general" && (
                            <section className="tab-panel">
                                <div className="form-group"><label>Nom</label><input value={name} onChange={e => setName(e.target.value)} /></div>
                                <div className="form-group"><label>Preu (€)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} /></div>
                                <div className="form-group"><label>Descompte (%)</label><input type="number" min="0" max="100" value={discountPercentage} onChange={e => setDiscountPercentage(e.target.value)} /></div>
                                <div className="form-group"><label>Inici descompte</label><input type="datetime-local" value={discountStartsAt} onChange={e => setDiscountStartsAt(e.target.value)} /></div>
                                <div className="form-group"><label>Fi descompte</label><input type="datetime-local" value={discountEndsAt} onChange={e => setDiscountEndsAt(e.target.value)} /></div>
                                <div className="form-group"><label>Descripció</label><textarea value={description} onChange={e => setDescription(e.target.value)} /></div>
                            </section>
                        )}

                        {activeTab === "inventario" && (
                            <section className="tab-panel">
                                <div className="form-group"><label>Codi</label><input value={code} onChange={e => setCode(e.target.value)} /></div>
                                <div className="form-group"><label>Stock</label><input type="number" value={stock} onChange={e => setStock(e.target.value)} /></div>
                                <div className="form-group"><label>Mida interior</label><input value={intSize} onChange={e => setIntSize(e.target.value)} /></div>
                                <div className="form-group"><label>Mida exterior</label><input value={extSize} onChange={e => setExtSize(e.target.value)} /></div>
                            </section>
                        )}

                        {activeTab === "avanzado" && (
                            <section className="tab-panel">
                                <div className="form-group">
                                    <label>Categoria</label>
                                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                                        <option value="">Sense categoria</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Destacat</label>
                                    <select value={highlighted} onChange={e => setHighlighted(e.target.value)}>
                                        <option value="0">No</option>
                                        <option value="1">Sí</option>
                                    </select>
                                </div>
                            </section>
                        )}

                        {activeTab === "caracteristics" && (
                            <section className="tab-panel">
                                <div className="panel-header">
                                    <h3>Atributs i Característiques</h3>
                                    <p>Configura els detalls tècnics d'aquest producte.</p>
                                </div>
                                <div className="characteristics-grid">
                                    {types.map(type => (
                                        <div key={type.id} className="char-item">
                                            <label className="char-label">{type.type}</label>
                                            <div className="char-field-wrapper">
                                                {type.type === "Doble Embrague" && (
                                                    <label className="checkbox-label">
                                                        <input type="checkbox" checked={selectedCharacteristics[type.id] || false} onChange={(e) => handleCharacteristicChange(type.id, e.target.checked)} />
                                                        <span>Incloure doble embragatge</span>
                                                    </label>
                                                )}
                                                {type.type === "Pes" && (
                                                    <div className="input-with-unit">
                                                        <input type="number" placeholder="0" value={selectedCharacteristics[type.id] || ""} onChange={(e) => handleCharacteristicChange(type.id, e.target.value)} />
                                                        <span className="unit-tag">Kg</span>
                                                    </div>
                                                )}
                                                {type.type === "Duplicat de clau" && (
                                                    <div className="extra-group">
                                                        <label className="checkbox-label">
                                                            <input type="checkbox" checked={extraValues[type.id]?.enabled || false} onChange={(e) => handleExtraValueChange(type.id, "enabled", e.target.checked)} />
                                                            <span>Permet duplicat de clau</span>
                                                        </label>
                                                        {extraValues[type.id]?.enabled && (
                                                            <div className="input-with-unit mt-10">
                                                                <input type="number" placeholder="Preu per còpia" value={extraValues[type.id]?.price || ""} onChange={(e) => handleExtraValueChange(type.id, "price", e.target.value)} />
                                                                <span className="unit-tag">€</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {type.type !== "Doble Embrague" && type.type !== "Pes" && type.type !== "Duplicat de clau" && (
                                                    <select className="full-select" value={selectedCharacteristics[type.id] || ""} onChange={(e) => handleCharacteristicChange(type.id, e.target.value)}>
                                                        <option value="">Selecciona...</option>
                                                        {type.characteristics?.map(char => <option key={char.id} value={char.id}>{char.description}</option>)}
                                                    </select>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === "imagenes" && (
                            <section className="tab-panel">
                                <div className="panel-header">
                                    <h3>Galeria de fotos</h3>
                                    <p>Puja les imatges i selecciona la principal amb la estrella.</p>
                                </div>
                                <div className="images-layout">
                                    <div className="upload-container">
                                        <label className={`drag-zone ${isDragging ? 'dragging' : ''}`}
                                            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}>
                                            <input type="file" multiple accept="image/*" onChange={e => handleFiles(e.target.files)} hidden />
                                            <div className="upload-info"><Upload size={24} /> <span>Pujar o arrossegar</span></div>
                                        </label>
                                    </div>
                                    <div className="previews-grid">
                                        {previews.map((url, index) => (
                                            <div key={index} className={`preview-item ${primaryImageIndex === index ? 'is-primary' : ''}`}>
                                                <img src={url} alt="" onClick={() => setPrimaryImageIndex(index)} />
                                                <div className="preview-actions">
                                                    <button type="button" className={`star-btn ${primaryImageIndex === index ? 'active' : ''}`} onClick={() => setPrimaryImageIndex(index)}>
                                                        <Star size={14} fill={primaryImageIndex === index ? "currentColor" : "none"} />
                                                    </button>
                                                    <button type="button" className="remove-btn" onClick={() => removeImage(index)}><X size={14} /></button>
                                                </div>
                                                {primaryImageIndex === index && <div className="primary-label">Principal</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                <div className="data-box-footer">
                    <button type="submit" className="save-button">
                        <Save size={18} /> Guardar producte
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductsCreate;