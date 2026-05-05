import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ArrowLeft, Info, Box, Settings, Image as ImageIcon, Save, LayoutList, X, Upload, Star, KeySquare } from "lucide-react";
import { Link } from "react-router-dom";

function PacksEdit() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(true);


  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  const [products, setProducts] = useState([]);
  const [productsInPack, setProductsInPack] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
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
  const [existingImages, setExistingImages] = useState([]);


  useEffect(() => {
    fetch(`http://localhost:8000/api/packs/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const product = data.product;
                    setName(product.name);
                    setPrice(product.sale_price);
                    setDiscount(product.discount || 0);
                    setDescription(product.description || "");
                    setCode(product.code);
                    setStock(product.stock);
                    setCategoryId(product.category_id || "");
                    setHighlighted(product.highlighted ? 1 : 0);
                  
                    if(product.pack){
                      product.pack.forEach(prod => {
                        setProductsInPack(prevProducts => prevProducts.concat(prod));
                      });
                    }
                    
                    // Cargar imágenes existentes
                    if (product.images) {
                        setExistingImages(product.images);
                        const primaryIndex = product.images.findIndex(img => img.is_primary);
                        if (primaryIndex !== -1) {
                            setPrimaryImageIndex(primaryIndex);
                        }
                    }
                }
                setLoading(false);
                console.log(data);
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

    fetch("http://localhost:8000/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        console.log(products)
      });
  }, []);

  const handleProductsInPack = (product) => {
    console.log("ID seleccionat:", product.id);

    if (productsInPack.find(p => p.id === product.id)) {
      setProductsInPack(prevProducts => prevProducts.filter(item => item.id !== product.id));
    }
    else {
      setProductsInPack(prevProducts => prevProducts.concat(product));
    }
  };

  // IMÁGENES
  const handleFiles = (files) => {
    const filesArray = Array.from(files);

    setImages(prev => [...prev, ...filesArray]);

    const urls = filesArray.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...urls]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));

    if (primaryImageIndex >= images.length - 1) {
      setPrimaryImageIndex(0);
    }
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

    formData.append("sale_price", price);
    formData.append("stock", stock);
    formData.append("discount", discount);
    formData.append("highlighted", highlighted ? 1 : 0);
    formData.append("category_id", categoryId);
    formData.append("product_type", "pack");
    formData.append("primary_image_index", primaryImageIndex);

    let charIndex = 0;

    /*
    for (let typeId in selectedCharacteristics) {
      const val = selectedCharacteristics[typeId];
      if (val !== "" && val !== null) {
        formData.append(`characteristics[${charIndex}][type_id]`, typeId);
        formData.append(`characteristics[${charIndex}][value]`, val);
        charIndex++;
      }
    }
    */
    images.forEach((file) => formData.append("images[]", file));

    fetch("http://localhost:8000/api/packs", {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAlert({ show: true, type: "success", message: "Pack Editat Correctament" });
          setTimeout(() => navigate("/admin/packs"), 2000);
        } else {
          setAlert({ show: true, type: "error", message: "Error en editar un pack" });
        }
      })
      .catch(() => setAlert({ show: true, type: "error", message: "Error de conexió amb el servidor" }));
  };

  return (
    <div className="dashboard-content">
      <div className="space-between mb-10">
        <h1 className="dashboard-title">Editar pack</h1>
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
              {/*<li className={activeTab === "caracteristics" ? "active" : ""} onClick={() => setActiveTab("caracteristics")}><LayoutList size={18} /> <span>Característiques</span></li>*/}
              <li className={activeTab === "imagenes" ? "active" : ""} onClick={() => setActiveTab("imagenes")}><ImageIcon size={18} /> <span>Imatges</span></li>
            </ul>
          </nav>

          <div className="data-content flex">

            {/* GENERAL */}
            {activeTab === "general" && (
              <section className="tab-panel">
                <div className="form-group"><label>Nom</label><input value={name} onChange={e => setName(e.target.value)} /></div>
                <div className="form-group"><label>Preu (€)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} /></div>
                <div className="form-group"><label>Descompte (%)</label><input type="number" value={discount} onChange={e => setDiscount(e.target.value)} /></div>
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
                          <th>Codi</th>
                          <th>Nom</th>
                          <th>Preu</th>
                        </tr>
                      </thead>
                      <tbody id="productsTable">
                        {products.products.map(product => (
                          <tr onClick={() => handleProductsInPack(product)} style={{ cursor: 'pointer' }}>
                            <td><input  type="checkbox" readOnly checked={productsInPack.some(p => p.id === product.id)} value={product} onClick={(e) => e.stopPropagation()}/></td>
                            <td>{product.code}</td>
                            <td>{product.name}</td>
                            <td>{product.sale_price}</td>
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
            {/*activeTab === "caracteristics" && (
              <section className="tab-panel">
                <div className="panel-header">
                  <h3>Atributs i Característiques</h3>
                  <p>Configura els detalls tècnics d'aquest pack.</p>
                </div>

                <div className="characteristics-grid">
                  {types.map(type => (
                    <div key={type.id} className="char-item">
                      <label className="char-label">{type.type}</label>

                      <div className="char-field-wrapper">
                        {type.type === "Doble Embrague" && (
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={selectedCharacteristics[type.id] || false}
                              onChange={(e) => handleCharacteristicChange(type.id, e.target.checked)}
                            />
                            <span>Incloure doble embragatge</span>
                          </label>
                        )}

                        {type.type === "Pes" && (
                          <div className="input-with-unit">
                            <input
                              type="number"
                              placeholder="0"
                              value={selectedCharacteristics[type.id] || ""}
                              onChange={(e) => handleCharacteristicChange(type.id, e.target.value)}
                            />
                            <span className="unit-tag">Kg</span>
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
                                />
                                <span className="unit-tag">€</span>
                              </div>
                            )}
                          </div>
                        )}

                        {type.type !== "Doble Embrague" &&
                          type.type !== "Pes" &&
                          type.type !== "Duplicat de clau" && (
                            <select
                              className="full-select"
                              value={selectedCharacteristics[type.id] || ""}
                              onChange={(e) => handleCharacteristicChange(type.id, e.target.value)}
                            >
                              <option value="">Selecciona...</option>
                              {type.characteristic?.map(char => (
                                <option key={char.id} value={char.id}>
                                  {char.description}
                                </option>
                              ))}
                            </select>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )*/}

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
                      onDrop={e => {
                        e.preventDefault();
                        setIsDragging(false);
                        handleFiles(e.dataTransfer.files);
                      }}>
                      <input type="file" multiple accept="image/*"
                        onChange={e => handleFiles(e.target.files)} hidden />
                      <div className="upload-info">
                        <Upload size={24} />
                        <span>Pujar o arrossegar</span>
                      </div>
                    </label>
                  </div>

                  <div className="previews-grid">
                    {previews.map((url, index) => (
                      <div key={index} className={`preview-item ${primaryImageIndex === index ? 'is-primary' : ''}`}>
                        <img src={url} alt="" onClick={() => setPrimaryImageIndex(index)} />

                        <div className="preview-actions">
                          <button type="button"
                            className={`star-btn ${primaryImageIndex === index ? 'active' : ''}`}
                            onClick={() => setPrimaryImageIndex(index)}>
                            <Star size={14} fill={primaryImageIndex === index ? "currentColor" : "none"} />
                          </button>

                          <button type="button"
                            className="remove-btn"
                            onClick={() => removeImage(index)}>
                            <X size={14} />
                          </button>
                        </div>

                        {primaryImageIndex === index && (
                          <div className="primary-label">Principal</div>
                        )}
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
export default PacksEdit;