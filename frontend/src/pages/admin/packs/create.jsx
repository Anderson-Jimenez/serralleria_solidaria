import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, Info, Box, Settings, Image as ImageIcon, Save, 
  CheckCircle, X, Upload, Star, KeySquare, AlertCircle, Trash2 
} from "lucide-react";

function PacksEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // UI States
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(true);

  // Data States
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsInPack, setProductsInPack] = useState([]);

  // Form States
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountStartsAt, setDiscountStartsAt] = useState("");
  const [discountEndsAt, setDiscountEndsAt] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  // Images States
  const [existingImages, setExistingImages] = useState([]); // Imágenes que ya están en el servidor
  const [newImages, setNewImages] = useState([]);           // Archivos nuevos (File objects)
  const [newPreviews, setNewPreviews] = useState([]);       // URLs para preview de archivos nuevos
  const [primaryType, setPrimaryType] = useState("existing"); // "existing" o "new"
  const [primaryIndex, setPrimaryIndex] = useState(0);

  useEffect(() => {
    // Cargar datos del pack
    fetch(`http://localhost:8000/api/packs/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const p = data.product;
          setName(p.name);
          setPrice(p.price); // Cambiado de sale_price a price
          setDiscountPercentage(p.discount_percentage || 0);
          setDiscountStartsAt(p.discount_starts_at ? p.discount_starts_at.split('T')[0] : "");
          setDiscountEndsAt(p.discount_ends_at ? p.discount_ends_at.split('T')[0] : "");
          setDescription(p.description || "");
          setCode(p.code);
          setStock(p.stock);
          setCategoryId(p.category_id || "");
          setHighlighted(p.highlighted ? 1 : 0);

          if (p.pack_items) {
            setProductsInPack(p.pack_items.map(item => item.product));
          }

          if (p.images) {
            setExistingImages(p.images);
            const pIdx = p.images.findIndex(img => img.is_primary);
            if (pIdx !== -1) {
              setPrimaryType("existing");
              setPrimaryIndex(pIdx);
            }
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando pack:", err);
        setLoading(false);
      });

    // Cargar Categorías
    fetch("http://localhost:8000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data.categories ?? data));

    // Cargar Productos Simples
    fetch("http://localhost:8000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data.products ?? data));
  }, [id]);

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => setAlert({ ...alert, show: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  const handleProductsInPack = (product) => {
    if (productsInPack.find(p => p.id === product.id)) {
      setProductsInPack(prev => prev.filter(item => item.id !== product.id));
    } else {
      setProductsInPack(prev => [...prev, product]);
    }
  };

  // Gestión de Imágenes Nuevas
  const handleFiles = (files) => {
    const filesArray = Array.from(files);
    setNewImages(prev => [...prev, ...filesArray]);
    const urls = filesArray.map(file => URL.createObjectURL(file));
    setNewPreviews(prev => [...prev, ...urls]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
    if (primaryType === "new" && primaryIndex === index) {
      setPrimaryType("existing");
      setPrimaryIndex(0);
    }
  };

  const removeExistingImage = (id) => {
    setExistingImages(prev => prev.filter(img => img.id !== id));
    setPrimaryType("existing");
    setPrimaryIndex(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("_method", "PUT"); // Necesario para que Laravel reciba archivos vía PUT
    formData.append("code", code);
    formData.append("name", name);
    formData.append("description", description || "");
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("discount_percentage", discountPercentage);
    formData.append("discount_starts_at", discountStartsAt || "");
    formData.append("discount_ends_at", discountEndsAt || "");
    formData.append("highlighted", highlighted);
    formData.append("category_id", categoryId);
    formData.append("product_type", "pack");

    // IDs de productos
    productsInPack.forEach(p => formData.append("product_ids[]", p.id));

    // Imágenes existentes que conservamos
    const existingIds = existingImages.map(img => img.id);
    formData.append("existing_images", JSON.stringify(existingIds));

    // Nuevos archivos
    newImages.forEach(file => formData.append("images[]", file));

    // Lógica de imagen principal para el controlador
    if (primaryType === "existing") {
      formData.append("primary_existing_index", primaryIndex);
    } else {
      formData.append("primary_new_index", primaryIndex);
    }

    fetch(`http://localhost:8000/api/packs/${id}`, {
      method: "POST", // Se usa POST con el _method PUT arriba
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAlert({ show: true, type: "success", message: "Pack actualitzat correctament" });
          setTimeout(() => navigate("/admin/packs"), 2000);
        } else {
          setAlert({ show: true, type: "error", message: "Error: " + (data.error || "No s'ha pogut actualitzar") });
        }
      })
      .catch(() => setAlert({ show: true, type: "error", message: "Error de conexió" }));
  };

  if (loading) return <div className="loading-screen">Carregant dades del pack...</div>;

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
        <h1 className="dashboard-title">Editar pack: <span className="text-muted">{name}</span></h1>
        <button type="button" className="action-icon" onClick={() => navigate("/admin/packs")}>
          <ArrowLeft size={18} /> Tornar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="product-data-box">
        <div className="data-box-header">
          <div className="title-section">
            <h2>Gestió de Pack</h2>
          </div>
        </div>

        <div className="data-box-body">
          <nav className="data-sidebar">
            <ul>
              <li className={activeTab === "general" ? "active" : ""} onClick={() => setActiveTab("general")}><Info size={18} /> <span>General</span></li>
              <li className={activeTab === "productes" ? "active" : ""} onClick={() => setActiveTab("productes")}><KeySquare size={18} /> <span>Productes</span></li>
              <li className={activeTab === "inventario" ? "active" : ""} onClick={() => setActiveTab("inventario")}><Box size={18} /> <span>Inventari</span></li>
              <li className={activeTab === "avanzado" ? "active" : ""} onClick={() => setActiveTab("avanzado")}><Settings size={18} /> <span>Avançat</span></li>
              <li className={activeTab === "imagenes" ? "active" : ""} onClick={() => setActiveTab("imagenes")}><ImageIcon size={18} /> <span>Imatges</span></li>
            </ul>
          </nav>

          <div className="data-content flex">
            {/* TAB GENERAL */}
            {activeTab === "general" && (
              <section className="tab-panel">
                <div className="form-group"><label>Nom del Pack</label><input value={name} onChange={e => setName(e.target.value)} required /></div>
                <div className="form-group"><label>Preu Total (€)</label><input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required /></div>
                
                <hr className="my-20" />
                <h3 className="mb-10">Configuració de Descompte</h3>
                <div className="grid-3">
                  <div className="form-group"><label>Descompte (%)</label><input type="number" value={discountPercentage} onChange={e => setDiscountPercentage(e.target.value)} /></div>
                  <div className="form-group"><label>Inici descompte</label><input type="date" value={discountStartsAt} onChange={e => setDiscountStartsAt(e.target.value)} /></div>
                  <div className="form-group"><label>Fi descompte</label><input type="date" value={discountEndsAt} onChange={e => setDiscountEndsAt(e.target.value)} /></div>
                </div>

                <div className="form-group"><label>Descripció</label><textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} /></div>
              </section>
            )}

            {/* TAB PRODUCTES */}
            {activeTab === "productes" && (
              <section className="tab-panel">
                <div className="table-container scrollable">
                  <div className="panel-header">
                    <h3>Selecció de Productes</h3>
                    <p>Selecciona els productes que formen aquest pack ({productsInPack.length} seleccionats)</p>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th width="40"></th>
                        <th>Codi</th>
                        <th>Nom</th>
                        <th>Preu Unit.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id} onClick={() => handleProductsInPack(product)} className="row-clickable">
                          <td>
                            <input 
                              type="checkbox" 
                              readOnly 
                              checked={productsInPack.some(p => p.id === product.id)} 
                            />
                          </td>
                          <td>{product.code}</td>
                          <td>{product.name}</td>
                          <td>{product.price}€</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* TAB INVENTARIO */}
            {activeTab === "inventario" && (
              <section className="tab-panel">
                <div className="form-group"><label>Codi de SKU / Pack</label><input value={code} onChange={e => setCode(e.target.value)} required /></div>
                <div className="form-group"><label>Stock Disponible</label><input type="number" value={stock} onChange={e => setStock(e.target.value)} required /></div>
              </section>
            )}

            {/* TAB AVANZADO */}
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
                  <label>Producte Destacat</label>
                  <select value={highlighted} onChange={e => setHighlighted(e.target.value)}>
                    <option value="0">No</option>
                    <option value="1">Sí</option>
                  </select>
                </div>
              </section>
            )}

            {/* TAB IMATGES */}
            {activeTab === "imagenes" && (
              <section className="tab-panel">
                <div className="panel-header">
                  <h3>Galeria d'Imatges</h3>
                  <p>Gestiona les imatges del pack. La marcada amb l'estrella serà la principal.</p>
                </div>

                <div className="upload-container mb-20">
                  <label className={`drag-zone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}>
                    <input type="file" multiple accept="image/*" onChange={e => handleFiles(e.target.files)} hidden />
                    <Upload size={24} />
                    <span>Afegir noves imatges</span>
                  </label>
                </div>

                <div className="previews-grid">
                  {/* IMÁGENES EXISTENTES */}
                  {existingImages.map((img, index) => (
                    <div key={`ex-${img.id}`} className={`preview-item ${primaryType === "existing" && primaryIndex === index ? 'is-primary' : ''}`}>
                      <img src={`http://localhost:8000/storage/${img.path}`} alt="" />
                      <div className="preview-actions">
                        <button type="button" className="star-btn" onClick={() => { setPrimaryType("existing"); setPrimaryIndex(index); }}>
                          <Star size={14} fill={primaryType === "existing" && primaryIndex === index ? "currentColor" : "none"} />
                        </button>
                        <button type="button" className="remove-btn" onClick={() => removeExistingImage(img.id)}><Trash2 size={14} /></button>
                      </div>
                      {primaryType === "existing" && primaryIndex === index && <div className="primary-label">Principal</div>}
                    </div>
                  ))}

                  {/* IMÁGENES NUEVAS */}
                  {newPreviews.map((url, index) => (
                    <div key={`new-${index}`} className={`preview-item ${primaryType === "new" && primaryIndex === index ? 'is-primary' : ''}`}>
                      <img src={url} alt="" />
                      <div className="preview-actions">
                        <button type="button" className="star-btn" onClick={() => { setPrimaryType("new"); setPrimaryIndex(index); }}>
                          <Star size={14} fill={primaryType === "new" && primaryIndex === index ? "currentColor" : "none"} />
                        </button>
                        <button type="button" className="remove-btn" onClick={() => removeNewImage(index)}><X size={14} /></button>
                      </div>
                      {primaryType === "new" && primaryIndex === index && <div className="primary-label">Nou (Principal)</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="data-box-footer">
          <button type="submit" className="save-button">
            <Save size={18} /> Guardar canvis del pack
          </button>
        </div>
      </form>
    </div>
  );
}

export default PacksEdit;