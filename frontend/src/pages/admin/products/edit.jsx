import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
    ArrowLeft, Info, Box, Settings, Image as ImageIcon, 
    Save, LayoutList, X, Upload, Star
} from "lucide-react";

function ProductsEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(true);

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
    const [intSize, setIntSize] = useState("");
    const [extSize, setExtSize] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [highlighted, setHighlighted] = useState(0);

    const [selectedCharacteristics, setSelectedCharacteristics] = useState({});
    const [extraValues, setExtraValues] = useState({});

    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8000/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const p = data.product;
                    setName(p.name);
                    setPrice(p.price);
                    setDiscountPercentage(p.discount_percentage || 0);
                    setDiscountStartsAt(p.discount_starts_at
                        ? new Date(p.discount_starts_at).toISOString().slice(0, 16)
                        : "");
                    setDiscountEndsAt(p.discount_ends_at
                        ? new Date(p.discount_ends_at).toISOString().slice(0, 16)
                        : "");
                    setDescription(p.description || "");
                    setCode(p.code);
                    setStock(p.stock);
                    setIntSize(p.int_size || "");
                    setExtSize(p.ext_size || "");
                    setCategoryId(p.category_id || "");
                    setHighlighted(p.highlighted ? 1 : 0);

                    if (p.characteristics) {
                        const chars = {};
                        p.characteristics.forEach(char => {
                            const typeId = char.characteristic?.characteristic_type_id;
                            if (typeId) {
                                chars[typeId] = char.characteristic_id ?? char.value;
                            }
                        });
                        setSelectedCharacteristics(chars);
                    }

                    if (p.images) {
                        setExistingImages(p.images);
                        const primaryIndex = p.images.findIndex(img => img.is_primary);
                        if (primaryIndex !== -1) setPrimaryImageIndex(primaryIndex);
                    }
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error:", err);
                setLoading(false);
            });

        fetch("http://localhost:8000/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data.categories ?? data));

        fetch("http://localhost:8000/api/characteristic-types")
            .then(res => res.json())
            .then(data => setTypes(data));
    }, [id]);

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

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PUT");
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

        const totalExistingCount = existingImages.length;

        if (primaryImageIndex < totalExistingCount) {
            formData.append("primary_existing_index", primaryImageIndex);
        } else if (totalExistingCount > 0 || images.length > 0) {
            formData.append("primary_new_index", primaryImageIndex - totalExistingCount);
        }

        let charIndex = 0;
        for (let typeId in selectedCharacteristics) {
            const val = selectedCharacteristics[typeId];
            formData.append(`characteristics[${charIndex}][type_id]`, typeId);
            formData.append(`characteristics[${charIndex}][value]`, val === undefined || val === null || val === false ? "" : val);
            charIndex++;
        }

        formData.append("existing_images", JSON.stringify(existingImages.map(img => img.id)));

        images.forEach((file) => formData.append("images[]", file));

        fetch(`http://localhost:8000/api/products/${id}`, {
            method: "POST",
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                navigate("/admin/products");
            } else {
                console.error("Error:", data.error);
                alert("Error al actualizar el producte");
            }
        })
        .catch(err => console.error("Fetch error:", err));
    };

    if (loading) {
        return (
            <div className="dashboard-content" role="main">
                <div className="space-between mb-10">
                    <h1 className="dashboard-title">Carregant producte...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-content" role="main" aria-label="Editar producte">
            <div className="space-between mb-10">
                <h1 className="dashboard-title" id="edit-product-title">Editar producte: {name}</h1>
                <button 
                    type="button" 
                    className="action-icon" 
                    onClick={() => navigate("/admin/products")}
                    aria-label="Tornar a la llista de productes"
                >
                    <ArrowLeft size={18} aria-hidden="true" /> Tornar
                </button>
            </div>

            <form onSubmit={handleSubmit} className="product-data-box" aria-labelledby="edit-product-title">
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
                                    >
                                        <option value="">Sense categoria</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="product-highlighted">Destacat</label>
                                    <select 
                                        id="product-highlighted"
                                        value={highlighted} 
                                        onChange={e => setHighlighted(Number(e.target.value))}
                                    >
                                        <option value={0}>No</option>
                                        <option value={1}>Sí</option>
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
                                                            <span>Incloure preu extra</span>
                                                        </label>
                                                        {extraValues[type.id]?.enabled && (
                                                            <div className="input-with-unit mt-10">
                                                                <input 
                                                                    type="number" 
                                                                    placeholder="Preu" 
                                                                    value={extraValues[type.id]?.price || ""} 
                                                                    onChange={(e) => handleExtraValueChange(type.id, "price", e.target.value)}
                                                                    aria-label="Preu extra en euros"
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
                                                        {type.characteristics?.map(char => (
                                                            <option key={char.id} value={char.id}>{char.description}</option>
                                                        ))}
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
                                        {existingImages.map((image, idx) => (
                                            <div 
                                                key={image.id} 
                                                className={`preview-item ${primaryImageIndex === idx ? 'is-primary' : ''}`}
                                                role="listitem"
                                            >
                                                <img 
                                                    src={`http://localhost:8000/storage/${image.path}`} 
                                                    alt={`Imatge existent ${idx + 1} de ${name}`}
                                                    onClick={() => setPrimaryImageIndex(idx)}
                                                />
                                                <div className="preview-actions">
                                                    <button 
                                                        type="button" 
                                                        className={`star-btn ${primaryImageIndex === idx ? 'active' : ''}`} 
                                                        onClick={() => setPrimaryImageIndex(idx)}
                                                        aria-label={primaryImageIndex === idx ? "Imatge principal actual" : "Marcar com a imatge principal"}
                                                    >
                                                        <Star size={14} fill={primaryImageIndex === idx ? "currentColor" : "none"} aria-hidden="true" />
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="remove-btn" 
                                                        onClick={() => removeExistingImage(idx)}
                                                        aria-label={`Eliminar imatge existent ${idx + 1}`}
                                                    >
                                                        <X size={14} aria-hidden="true" />
                                                    </button>
                                                </div>
                                                {primaryImageIndex === idx && <div className="primary-label" aria-label="Imatge principal">Principal</div>}
                                            </div>
                                        ))}

                                        {previews.map((url, idx) => {
                                            const globalIndex = existingImages.length + idx;
                                            return (
                                                <div 
                                                    key={`new_${idx}`} 
                                                    className={`preview-item ${primaryImageIndex === globalIndex ? 'is-primary' : ''}`}
                                                    role="listitem"
                                                >
                                                    <img 
                                                        src={url} 
                                                        alt={`Vista prèvia de la nova imatge ${idx + 1}`}
                                                        onClick={() => setPrimaryImageIndex(globalIndex)}
                                                    />
                                                    <div className="preview-actions">
                                                        <button 
                                                            type="button" 
                                                            className={`star-btn ${primaryImageIndex === globalIndex ? 'active' : ''}`} 
                                                            onClick={() => setPrimaryImageIndex(globalIndex)}
                                                            aria-label={primaryImageIndex === globalIndex ? "Imatge principal actual" : "Marcar com a imatge principal"}
                                                        >
                                                            <Star size={14} fill={primaryImageIndex === globalIndex ? "currentColor" : "none"} aria-hidden="true" />
                                                        </button>
                                                        <button 
                                                            type="button" 
                                                            className="remove-btn" 
                                                            onClick={() => removeImage(idx)}
                                                            aria-label={`Eliminar nova imatge ${idx + 1}`}
                                                        >
                                                            <X size={14} aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                    {primaryImageIndex === globalIndex && <div className="primary-label" aria-label="Imatge principal">Principal</div>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                <div className="data-box-footer">
                    <button type="submit" className="save-button" aria-label="Actualitzar producte">
                        <Save size={18} aria-hidden="true" /> Actualitzar producte
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductsEdit;