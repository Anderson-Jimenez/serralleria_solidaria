import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Info, Box, Settings, Image as ImageIcon,
  Save, LayoutList, X, Upload, Star, KeySquare
} from "lucide-react";

function ProductsCreate() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  const [products, setProducts] = useState([]);
  const [productsInPack, setProductsInPack] = useState([]);

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

    fetch("http://localhost:8000/api/products")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setProducts(data);
      });
  }, []);

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => setAlert({ ...alert, show: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);


  const handleProductsInPack = (product) => {
    console.log("ID seleccionat:", product.id);

    if (productsInPack.find(p => p.id === product.id)) {
      setProductsInPack(prevProducts => prevProducts.filter(item => item.id !== product.id));
    }
    else {
      setProductsInPack(prevProducts => prevProducts.concat(product));
    }
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

    productsInPack.forEach((product) => {
      // Afegim cada ID individualment usant la nomenclatura de claudàtors []
      formData.append("product_ids[]", product.id);
    });

    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("discount_percentage", discountPercentage);
    formData.append("discount_starts_at", discountStartsAt);
    formData.append("discount_ends_at", discountEndsAt);
    formData.append("highlighted", highlighted ? 1 : 0);
    formData.append("category_id", categoryId);
    formData.append("product_type", "pack");
    formData.append("primary_image_index", primaryImageIndex);

    let charIndex = 0;

    images.forEach((file) => formData.append("images[]", file));

    fetch("http://localhost:8000/api/packs", {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAlert({ show: true, type: "success", message: "Pack Pujat correctament" });
          setTimeout(() => navigate("/admin/packs"), 2000);
        } else {
          setAlert({ show: true, type: "error", message: "Error en pujar un pack" });
        }
      })
      .catch(() => setAlert({ show: true, type: "error", message: "Error de conexió amb el servidor" }));
  };

  return (
    <div className="dashboard-content">
      <div className="space-between mb-10">
        <h1 className="dashboard-title">Crear nou pack</h1>
        <button type="button" className="action-icon" onClick={() => navigate("/admin/packs")}>
          <ArrowLeft size={18} /> Tornar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="product-data-box">
        <div className="data-box-header">
          <div className="title-section">
            <h2>Dades del pack</h2>
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

            {/* GENERAL */}
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

            {/* Productes */}
            {activeTab === "productes" && (
              <section className="tab-panel">
                <div className="productsInPack">
                  <div className="table-container scrollable">
                    <h3>Productes</h3>
                    <div className="tableFilters tableFiltersInPacks">
                      <input
                        type="text"
                        placeholder="Cerca per nom, codi o descripció..."
                      /*onChange={searchPacks}*/
                      />

                      <select>

                      </select>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Codi</th>
                          <th>Nom</th>
                          <th>Preu</th>
                        </tr>
                      </thead>
                      <tbody id="productsTable">
                        {products.products.map(product => (
                          <tr onClick={() => handleProductsInPack(product)} style={{ cursor: 'pointer' }}>
                            <td><input type="checkbox" readOnly checked={productsInPack.some(p => p.id === product.id)} value={product} onClick={(e) => e.stopPropagation()} /></td>
                            <td>{product.code}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* INVENTARIO */}
            {activeTab === "inventario" && (
              <section className="tab-panel">
                <div className="form-group"><label>Codi</label><input value={code} onChange={e => setCode(e.target.value)} /></div>
                <div className="form-group"><label>Stock</label><input type="number" value={stock} onChange={e => setStock(e.target.value)} /></div>
              </section>
            )}

            {/* AVANZADO */}
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
                  <label>Destacat</label>
                  <select value={highlighted} onChange={e => setHighlighted(e.target.value)}>
                    <option value="0">No</option>
                    <option value="1">Sí</option>
                  </select>
                </div>
              </section>
            )}

            {/* IMÁGENES */}
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
            <Save size={18} /> Guardar pack
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductsCreate;