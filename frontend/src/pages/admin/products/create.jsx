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

    const [weight, setWeight] = useState(0);

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
        <div className="dashboard-content" role="main" aria-label="Crear nou producte">
            {alert.show && (
                <div 
                    className={`alert-toast ${alert.type}`} 
                    role="alert"
                    aria-live="polite"
                >
                    {alert.type === "success" ? <CheckCircle size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}
                    <p>{alert.message}</p>
                    <X 
                        size={16} 
                        className="close-alert" 
                        onClick={() => setAlert({ ...alert, show: false })}
                        role="button"
                        tabIndex={0}
                        aria-label="Tancar alerta"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                setAlert({ ...alert, show: false });
                            }
                        }}
                    />
                </div>
            )}

            <div className="space-between mb-10">
                <h1 className="dashboard-title" id="create-product-title">Crear nou producte</h1>
                <button 
                    type="button" 
                    className="action-icon" 
                    onClick={() => navigate("/admin/products")}
                    aria-label="Tornar a la llista de productes"
                >
                    <ArrowLeft size={18} aria-hidden="true" /> Tornar
                </button>
            </div>

            <form onSubmit={handleSubmit} className="product-data-box" aria-labelledby="create-product-title">
                <div className="data-box-header">
                    <div className="title-section">
                        <h2>Dades del producte</h2>
                        <select disabled aria-label="Tipus de producte (fix)">
                            <option>Producte simple</option>
                        </select>
                    </div>
                </div>

                <div className="data-box-body">
                    <nav className="data-sidebar" aria-label="Seccions del formulari">
                        <ul role="tablist" aria-label="Pestanyes de formulari">
                            <li 
                                className={activeTab === "general" ? "active" : ""} 
                                onClick={() => setActiveTab("general")}
                                role="tab"
                                tabIndex={activeTab === "general" ? 0 : -1}
                                aria-selected={activeTab === "general"}
                                aria-controls="general-panel"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setActiveTab("general");
                                    }
                                }}
                            ><Info size={18} aria-hidden="true" /> <span>General</span></li>
                            <li 
                                className={activeTab === "inventario" ? "active" : ""} 
                                onClick={() => setActiveTab("inventario")}
                                role="tab"
                                tabIndex={activeTab === "inventario" ? 0 : -1}
                                aria-selected={activeTab === "inventario"}
                                aria-controls="inventario-panel"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setActiveTab("inventario");
                                    }
                                }}
                            ><Box size={18} aria-hidden="true" /> <span>Inventari</span></li>
                            <li 
                                className={activeTab === "avanzado" ? "active" : ""} 
                                onClick={() => setActiveTab("avanzado")}
                                role="tab"
                                tabIndex={activeTab === "avanzado" ? 0 : -1}
                                aria-selected={activeTab === "avanzado"}
                                aria-controls="avanzado-panel"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setActiveTab("avanzado");
                                    }
                                }}
                            ><Settings size={18} aria-hidden="true" /> <span>Avançat</span></li>
                            <li 
                                className={activeTab === "caracteristics" ? "active" : ""} 
                                onClick={() => setActiveTab("caracteristics")}
                                role="tab"
                                tabIndex={activeTab === "caracteristics" ? 0 : -1}
                                aria-selected={activeTab === "caracteristics"}
                                aria-controls="caracteristics-panel"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setActiveTab("caracteristics");
                                    }
                                }}
                            ><LayoutList size={18} aria-hidden="true" /> <span>Característiques</span></li>
                            <li 
                                className={activeTab === "imagenes" ? "active" : ""} 
                                onClick={() => setActiveTab("imagenes")}
                                role="tab"
                                tabIndex={activeTab === "imagenes" ? 0 : -1}
                                aria-selected={activeTab === "imagenes"}
                                aria-controls="imagenes-panel"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setActiveTab("imagenes");
                                    }
                                }}
                            ><ImageIcon size={18} aria-hidden="true" /> <span>Imatges</span></li>
                        </ul>
                    </nav>

                    <div className="data-content flex">
                        {activeTab === "general" && (
                            <section 
                                className="tab-panel" 
                                id="general-panel"
                                role="tabpanel"
                                aria-labelledby="general-tab"
                            >
                                <div className="form-group">
                                    <label htmlFor="product-name">Nom</label>
                                    <input 
                                        id="product-name"
                                        value={name} 
                                        onChange={e => setName(e.target.value)} 
                                        aria-required="true"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="product-price">Preu (€)</label>
                                    <input 
                                        id="product-price"
                                        type="number" 
                                        value={price} 
                                        onChange={e => setPrice(e.target.value)}
                                        aria-required="true"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="product-discount">Descompte (%)</label>
                                    <input 
                                        id="product-discount"
                                        type="number" 
                                        min="0" 
                                        max="100" 
                                        value={discountPercentage} 
                                        onChange={e => setDiscountPercentage(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="discount-start">Inici descompte</label>
                                    <input 
                                        id="discount-start"
                                        type="datetime-local" 
                                        value={discountStartsAt} 
                                        onChange={e => setDiscountStartsAt(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="discount-end">Fi descompte</label>
                                    <input 
                                        id="discount-end"
                                        type="datetime-local" 
                                        value={discountEndsAt} 
                                        onChange={e => setDiscountEndsAt(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="product-description">Descripció</label>
                                    <textarea 
                                        id="product-description"
                                        value={description} 
                                        onChange={e => setDescription(e.target.value)} 
                                    />
                                </div>
                            </section>
                        )}

                        {activeTab === "inventario" && (
                            <section 
                                className="tab-panel" 
                                id="inventario-panel"
                                role="tabpanel"
                                aria-labelledby="inventario-tab"
                            >
                                <div className="form-group">
                                    <label htmlFor="product-code">Codi</label>
                                    <input id="product-code" value={code} onChange={e => setCode(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="product-stock">Stock</label>
                                    <input 
                                        id="product-stock"
                                        type="number" 
                                        value={stock} 
                                        onChange={e => setStock(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="int-size">Mida interior</label>
                                    <input id="int-size" value={intSize} onChange={e => setIntSize(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="ext-size">Mida exterior</label>
                                    <input id="ext-size" value={extSize} onChange={e => setExtSize(e.target.value)} />
                                </div>
                            </section>
                        )}

                        {activeTab === "avanzado" && (
                            <section 
                                className="tab-panel" 
                                id="avanzado-panel"
                                role="tabpanel"
                                aria-labelledby="avanzado-tab"
                            >
                                <div className="form-group">
                                    <label htmlFor="product-category">Categoria</label>
                                    <select 
                                        id="product-category"
                                        value={categoryId} 
                                        onChange={e => setCategoryId(e.target.value)} 
                                        required
                                        aria-required="true"
                                    >
                                        <option value="">Sense categoria</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="product-highlighted">Destacat</label>
                                    <select 
                                        id="product-highlighted"
                                        value={highlighted} 
                                        onChange={e => setHighlighted(e.target.value)}
                                    >
                                        <option value="0">No</option>
                                        <option value="1">Sí</option>
                                    </select>
                                </div>
                            </section>
                        )}

                        {activeTab === "caracteristics" && (
                            <section 
                                className="tab-panel" 
                                id="caracteristics-panel"
                                role="tabpanel"
                                aria-labelledby="caracteristics-tab"
                            >
                                <div className="panel-header">
                                    <h3>Atributs i Característiques</h3>
                                    <p>Configura els detalls tècnics d'aquest producte.</p>
                                </div>
                                <div className="characteristics-grid">
                                    {types.map(type => (
                                        <div key={type.id} className="char-item">
                                            <label className="char-label" id={`char-label-${type.id}`}>{type.type}</label>
                                            <div className="char-field-wrapper" aria-labelledby={`char-label-${type.id}`}>
                                                {type.type === "Doble Embrague" && (
                                                    <label className="checkbox-label">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedCharacteristics[type.id] || false} 
                                                            onChange={(e) => handleCharacteristicChange(type.id, e.target.checked)}
                                                            aria-describedby={`char-desc-${type.id}`}
                                                        />
                                                        <span id={`char-desc-${type.id}`}>Incloure doble embragatge</span>
                                                    </label>
                                                )}
                                                {type.type === "Pes" && (
                                                    <div className="input-with-unit">
                                                        <input 
                                                            type="number" 
                                                            placeholder="0" 
                                                            value={selectedCharacteristics[type.id] || ""} 
                                                            onChange={(e) => handleCharacteristicChange(type.id, e.target.value)}
                                                            aria-label={`Pes en quilograms per a ${type.type}`}
                                                        />
                                                        <span className="unit-tag" aria-hidden="true">Kg</span>
                                                    </div>
                                                )}
                                                {type.type === "Duplicat de clau" && (
                                                    <div className="extra-group">
                                                        <label className="checkbox-label">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={extraValues[type.id]?.enabled || false} 
                                                                onChange={(e) => handleExtraValueChange(type.id, "enabled", e.target.checked)}
                                                            />
                                                            <span>Permet duplicat de clau</span>
                                                        </label>
                                                        {extraValues[type.id]?.enabled && (
                                                            <div className="input-with-unit mt-10">
                                                                <input 
                                                                    type="number" 
                                                                    placeholder="Preu per còpia" 
                                                                    value={extraValues[type.id]?.price || ""} 
                                                                    onChange={(e) => handleExtraValueChange(type.id, "price", e.target.value)}
                                                                    aria-label="Preu per còpia de clau en euros"
                                                                />
                                                                <span className="unit-tag" aria-hidden="true">€</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {type.type !== "Doble Embrague" && type.type !== "Pes" && type.type !== "Duplicat de clau" && (
                                                    <select 
                                                        className="full-select" 
                                                        value={selectedCharacteristics[type.id] || ""} 
                                                        onChange={(e) => handleCharacteristicChange(type.id, e.target.value)}
                                                        aria-label={`Seleccionar ${type.type}`}
                                                    >
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
                            <section 
                                className="tab-panel" 
                                id="imagenes-panel"
                                role="tabpanel"
                                aria-labelledby="imagenes-tab"
                            >
                                <div className="panel-header">
                                    <h3>Galeria de fotos</h3>
                                    <p>Puja les imatges i selecciona la principal amb la estrella.</p>
                                </div>
                                <div className="images-layout">
                                    <div className="upload-container">
                                        <label 
                                            className={`drag-zone ${isDragging ? 'dragging' : ''}`}
                                            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                                            aria-label="Arrossega imatges o fes clic per seleccionar"
                                        >
                                            <input 
                                                type="file" 
                                                multiple 
                                                accept="image/*" 
                                                onChange={e => handleFiles(e.target.files)} 
                                                hidden 
                                            />
                                            <div className="upload-info" aria-hidden="true">
                                                <Upload size={24} /> <span>Pujar o arrossegar</span>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="previews-grid" role="list" aria-label="Vista prèvia d'imatges">
                                        {previews.map((url, index) => (
                                            <div 
                                                key={index} 
                                                className={`preview-item ${primaryImageIndex === index ? 'is-primary' : ''}`}
                                                role="listitem"
                                            >
                                                <img 
                                                    src={url} 
                                                    alt={`Vista prèvia de la imatge ${index + 1}`} 
                                                    onClick={() => setPrimaryImageIndex(index)}
                                                />
                                                <div className="preview-actions">
                                                    <button 
                                                        type="button" 
                                                        className={`star-btn ${primaryImageIndex === index ? 'active' : ''}`} 
                                                        onClick={() => setPrimaryImageIndex(index)}
                                                        aria-label={primaryImageIndex === index ? "Imatge principal actual" : "Marcar com a imatge principal"}
                                                    >
                                                        <Star size={14} fill={primaryImageIndex === index ? "currentColor" : "none"} aria-hidden="true" />
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="remove-btn" 
                                                        onClick={() => removeImage(index)}
                                                        aria-label={`Eliminar imatge ${index + 1}`}
                                                    >
                                                        <X size={14} aria-hidden="true" />
                                                    </button>
                                                </div>
                                                {primaryImageIndex === index && <div className="primary-label" aria-label="Imatge principal">Principal</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                <div className="data-box-footer">
                    <button type="submit" className="save-button" aria-label="Guardar producte">
                        <Save size={18} aria-hidden="true" /> Guardar producte
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductsCreate;