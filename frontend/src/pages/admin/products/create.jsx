import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ArrowLeft, Info, Box, Settings, Image as ImageIcon, 
    Save, LayoutList, X, Upload, Star, CheckSquare, Hash 
} from "lucide-react";

function ProductsCreate() {
    const navigate = useNavigate();

    // Navegación de pestañas
    const [activeTab, setActiveTab] = useState("general");

    // Datos maestros (API)
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    // Estado del Formulario: General
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [description, setDescription] = useState("");

    // Estado del Formulario: Inventario
    const [code, setCode] = useState("");
    const [stock, setStock] = useState(0);

    // Estado del Formulario: Avanzado
    const [categoryId, setCategoryId] = useState("");
    const [highlighted, setHighlighted] = useState(0);

    // Estado: Características
    const [selectedType, setSelectedType] = useState("");
    const [availableCharacteristics, setAvailableCharacteristics] = useState([]);
    const [selectedCharacteristics, setSelectedCharacteristics] = useState([]);

    // Estado: Imágenes
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchCharacteristicTypes();
    }, []);

    const fetchCategories = () => {
        fetch("http://localhost:8000/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data.categories ?? data))
            .catch(err => console.error(err));
    };

    const fetchCharacteristicTypes = () => {
        fetch("http://localhost:8000/api/characteristic-types")
            .then(res => res.json())
            .then(data => setTypes(data))
            .catch(err => console.error(err));
    };

    // --- Lógica de Características ---
    const handleTypeChange = (typeId) => {
        setSelectedType(typeId);
        const type = types.find(t => t.id == typeId);
        setAvailableCharacteristics(type ? type.characteristic : []);
    };

    const addCharacteristic = (charId) => {
        if (!charId) return;
        const char = availableCharacteristics.find(c => c.id == charId);
        if (!char || selectedCharacteristics.find(c => c.characteristic_id == charId)) return;

        // Lógica dinámica: Si es peso/kg usamos número, si no, checkbox
        const desc = char.description.toLowerCase();
        const isNumeric = desc.includes("pes") || desc.includes("kg") || desc.includes("mida");
        
        setSelectedCharacteristics(prev => [...prev, {
            characteristic_id: char.id,
            name: char.description,
            value: isNumeric ? 0 : true,
            type: isNumeric ? 'number' : 'boolean'
        }]);
    };

    const updateCharValue = (id, newValue) => {
        setSelectedCharacteristics(prev => prev.map(c => 
            c.characteristic_id === id ? { ...c, value: newValue } : c
        ));
    };

    const removeCharacteristic = (id) => {
        setSelectedCharacteristics(prev => prev.filter(c => c.characteristic_id != id));
    };

    // --- Lógica de Imágenes ---
    const handleFiles = (files) => {
        const validFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
        setImages(prev => [...prev, ...validFiles]);
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
        if (primaryImageIndex === index) setPrimaryImageIndex(0);
        else if (primaryImageIndex > index) setPrimaryImageIndex(primaryImageIndex - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        formData.append("code", code);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("discount", discount);
        formData.append("highlighted", highlighted);
        formData.append("category_id", categoryId);
        formData.append("product_type", "simple");
        formData.append("primary_image_index", primaryImageIndex);

        selectedCharacteristics.forEach((c, i) => {
            formData.append(`characteristics[${i}][characteristic_id]`, c.characteristic_id);
            formData.append(`characteristics[${i}][value]`, c.value);
        });

        images.forEach((file) => {
            formData.append("images[]", file);
        });

        fetch("http://localhost:8000/api/products", { method: "POST", body: formData })
            .then(res => res.json())
            .then(() => navigate("/admin/products"))
            .catch(err => console.error(err));
    };

    return (
        <div className="dashboard-content">
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
                        {/* PESTAÑA GENERAL */}
                        {activeTab === "general" && (
                            <section className="tab-panel">
                                <div className="form-group"><label>Nom</label><input type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
                                <div className="form-group"><label>Preu (€)</label><input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} /></div>
                                <div className="form-group"><label>Descompte (%)</label><input type="number" min="0" max="100" value={discount} onChange={e => setDiscount(e.target.value)} /></div>
                                <div className="form-group"><label>Descripció</label><textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} /></div>
                            </section>
                        )}

                        {/* PESTAÑA INVENTARIO (RECUPERADA) */}
                        {activeTab === "inventario" && (
                            <section className="tab-panel">
                                <div className="form-group">
                                    <label>Codi (SKU)</label>
                                    <input type="text" value={code} onChange={e => setCode(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Stock disponible</label>
                                    <input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} />
                                </div>
                            </section>
                        )}

                        {/* PESTAÑA AVANZADO (RECUPERADA) */}
                        {activeTab === "avanzado" && (
                            <section className="tab-panel">
                                <div className="form-group">
                                    <label>Categoria</label>
                                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                                        <option value="">Sense categoria</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Producte destacat</label>
                                    <select value={highlighted} onChange={e => setHighlighted(e.target.value)}>
                                        <option value="0">No</option>
                                        <option value="1">Sí</option>
                                    </select>
                                </div>
                            </section>
                        )}

                        {/* PESTAÑA CARACTERÍSTICAS */}
                        {activeTab === "caracteristics" && (
                            <section className="tab-panel">
                                <div className="panel-header">
                                    <h3>Atributs i Característiques</h3>
                                    <p>Afegeix detalls tècnics com pes, tipus de targeta o embrague.</p>
                                </div>
                                <div className="form-group">
                                    <label>Tipus</label>
                                    <select value={selectedType} onChange={e => handleTypeChange(e.target.value)}>
                                        <option value="">Selecciona tipus...</option>
                                        {types.map(type => <option key={type.id} value={type.id}>{type.type}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Afegir Atribut</label>
                                    <select value="" onChange={e => addCharacteristic(e.target.value)} disabled={!selectedType}>
                                        <option value="" disabled>Selecciona una característica</option>
                                        {availableCharacteristics.map(char => <option key={char.id} value={char.id}>{char.description}</option>)}
                                    </select>
                                </div>
                                <div className="selected-characteristics-list">
                                    {selectedCharacteristics.map(char => (
                                        <div key={char.characteristic_id} className="char-input-row">
                                            <div className="char-info">
                                                {char.type === 'number' ? <Hash size={16} /> : <CheckSquare size={16} />}
                                                <span>{char.name}</span>
                                            </div>
                                            <div className="char-controls">
                                                {char.type === 'number' ? (
                                                    <input type="number" value={char.value} onChange={e => updateCharValue(char.characteristic_id, e.target.value)} className="small-input" />
                                                ) : (
                                                    <input type="checkbox" checked={char.value} onChange={e => updateCharValue(char.characteristic_id, e.target.checked)} />
                                                )}
                                                <button type="button" className="delete-btn" onClick={() => removeCharacteristic(char.characteristic_id)}><X size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* PESTAÑA IMÁGENES */}
                        {activeTab === "imagenes" && (
                            <section className="tab-panel">
                                <div className="panel-header">
                                    <h3>Galeria de fotos</h3>
                                    <p>Puja les imatges i selecciona la principal amb la estrella.</p>
                                </div>
                                <div className="images-layout">
                                    <div className="upload-container">
                                        <label className={`drag-zone ${isDragging ? 'dragging' : ''}`} onDragOver={e => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}>
                                            <input type="file" multiple accept="image/*" onChange={e => handleFiles(e.target.files)} hidden />
                                            <div className="upload-info"><Upload size={24} /><span>Pujar o arrossegar</span></div>
                                        </label>
                                    </div>
                                    <div className="previews-grid">
                                        {previews.map((url, index) => (
                                            <div key={index} className={`preview-item ${primaryImageIndex === index ? 'is-primary' : ''}`}>
                                                <img src={url} alt="preview" onClick={() => setPrimaryImageIndex(index)} />
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
                    <button type="submit" className="save-button"><Save size={18} /> Guardar producte</button>
                </div>
            </form>
        </div>
    );
}

export default ProductsCreate;