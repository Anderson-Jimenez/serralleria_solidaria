import React from 'react';
import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';

function productDisplaySearch({ products, characteristics, title }) {
  const navigate = useNavigate();
  const { refreshCart, updateOrderId } = useCart();

  const [productsFiltrats, setProductsFiltrats] = useState([]);
  const [savedFilters, setSavedFilters] = useState([]);
  const [dinamicFilters, setDinamicFilters] = useState({});
  const [savedText, setSavedText] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [productTypes, setProductTypes] = useState([]);

  const [añadidos, setAñadidos] = useState(new Set());
  const [sinStock, setSinStock] = useState(new Set());

  const [openFilters, setOpenFilters] = useState({});

  const toggleFilter = (id) => {
    setOpenFilters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    setProductsFiltrats(products);
  }, [products]);

  const isDiscountActive = (product) => {
    if (!product?.discount_percentage) return false;
    const now = new Date();
    const afterStart = !product.discount_starts_at || new Date(product.discount_starts_at) <= now;
    const beforeEnd = !product.discount_ends_at || new Date(product.discount_ends_at) >= now;
    return afterStart && beforeEnd;
  };

  const getFinalPrice = (product) => {
    if (!product) return '0.00';
    if (!isDiscountActive(product)) return parseFloat(product.price).toFixed(2);
    return (product.price - (product.price / 100) * product.discount_percentage).toFixed(2);
  };

  const handleProductClick = (productId) => {
    navigate(`/producte/${productId}`);
  };

  const saveFilter = (e) => {
    const filterValue = e.target.value;
    let updatedFilters;

    if (filterValue !== "") {
      if (savedFilters.includes(filterValue)) {
        updatedFilters = savedFilters.filter(item => item !== filterValue);
      } else {
        updatedFilters = [...savedFilters, filterValue];
      }
    } else {
      updatedFilters = [...savedFilters];
    }

    setSavedFilters(updatedFilters);
    searchProductsInStore(savedText, updatedFilters, dinamicFilters, minPrice, maxPrice, productTypes);
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    let updatedFilters = { ...dinamicFilters, [name]: value };
    if (value === "") delete updatedFilters[name];
    setDinamicFilters(updatedFilters);
    searchProductsInStore(savedText, savedFilters, updatedFilters, minPrice, maxPrice, productTypes);
  };

  const handleProductTypeChange = (e) => {
    const value = e.target.value;
    let updated;
    if (productTypes.includes(value)) {
      updated = productTypes.filter(t => t !== value);
    } else {
      updated = [...productTypes, value];
    }
    setProductTypes(updated);
    searchProductsInStore(savedText, savedFilters, dinamicFilters, minPrice, maxPrice, updated);
  };

  const searchProductsInStore = (text = savedText, filters = savedFilters, selectFilters = dinamicFilters, minimumPrice = minPrice, maximumPrice = maxPrice, types = productTypes) => {
    fetch(`http://localhost:8000/api/products/searchAllProductsInStore`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        searchText: text,
        filters: filters,
        selectFilters: selectFilters,
        minPrice: minimumPrice,
        maxPrice: maximumPrice,
        productTypes: types,
      })
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) { console.error("Error del servidor:", data); return; }
        if (data.success) {
          setProductsFiltrats(data.products);
        }
      })
      .catch(error => console.error('Error en la petició:', error));
  };

  async function handleAddToCart(e, product) {
    e.stopPropagation();

    if (sinStock.has(product.id)) return;

    try {
      const response = await fetch('http://localhost:8000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
          order_id: localStorage.getItem('order_id') ?? null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.toLowerCase().includes('stock')) {
          setSinStock(prev => new Set(prev).add(product.id));
        }
        return;
      }

      if (data.order_id) {
        updateOrderId(data.order_id);
      } else {
        refreshCart();
      }

      window.dispatchEvent(new Event('cart-updated'));

      setAñadidos(prev => new Set(prev).add(product.id));
      setTimeout(() => {
        setAñadidos(prev => {
          const copia = new Set(prev);
          copia.delete(product.id);
          return copia;
        });
      }, 1500);

    } catch (error) {
      console.error('Error carrito:', error);
    }
  }

  return (
    // ♿ aria-label identifica la sección
    <section className='categoryProductDisplay' aria-label="Catàleg de productes">
      <div className="section-header">
        <div className="title-group">
          <span className="subtitle">CATÀLEG</span>
          <h2 className="main-title">
            Tots els<br />
            <span>{title}</span>
          </h2>
        </div>
      </div>

      <div id='categoryProductDisplayAll'>
        {/* ♿ role="search" marca la zona de filtros semánticamente */}
        <div className='displayFilters' role="search" aria-label="Filtres de productes">
          <h2>Filtres</h2>
          <div className="allFilters">
            <div className="uniqueCharacteristic" key="sale_price">
              <h3>Preu</h3>
              <div className="rangeFilter">
                {/* ♿ labels visualmente ocultos para lectores de pantalla */}
                <label htmlFor="minPriceAll" className="sr-only">Preu mínim</label>
                <input
                  id="minPriceAll"
                  type="number"
                  placeholder="Mínim"
                  min="0"
                  value={minPrice}
                  aria-label="Preu mínim en euros"
                  onChange={(e) => { setMinPrice(e.target.value); searchProductsInStore(savedText, savedFilters, dinamicFilters, e.target.value, maxPrice); }}
                />€
                <span className="rangeSeparator" aria-hidden="true">—</span>
                <label htmlFor="maxPriceAll" className="sr-only">Preu màxim</label>
                <input
                  id="maxPriceAll"
                  type="number"
                  placeholder="Màxim"
                  min="0"
                  value={maxPrice}
                  aria-label="Preu màxim en euros"
                  onChange={(e) => { setMaxPrice(e.target.value); searchProductsInStore(savedText, savedFilters, dinamicFilters, minPrice, e.target.value); }}
                />€
              </div>
            </div>

            {/* ♿ role="group" + aria-labelledby agrupa los checkboxes */}
            <div className="uniqueCharacteristic" key="product_type">
              <h3 id="label-tipus-all">Tipus</h3>
              <div className='checkboxFilter' role="group" aria-labelledby="label-tipus-all">
                <div>
                  <input className='checkmark' type="checkbox" id="simpleAll" value="simple"
                    checked={productTypes.includes("simple")}
                    onChange={handleProductTypeChange} />
                  <label className='checkmarkLabel' htmlFor="simpleAll">Producte</label>
                </div>
                <div>
                  <input className='checkmark' type="checkbox" id="packAll" value="pack"
                    checked={productTypes.includes("pack")}
                    onChange={handleProductTypeChange} />
                  <label className='checkmarkLabel' htmlFor="packAll">Pack</label>
                </div>
              </div>
            </div>

            {characteristics.map((characteristic) => (
              <div className="uniqueCharacteristic" key={characteristic.id}>
                {/* ♿ id en h3 para referenciar desde group/select */}
                <h3 id={`label-char-all-${characteristic.id}`}>{characteristic.type}</h3>
                {characteristic.filterType === 'checkbox' ? (
                  <div className='checkboxFilter' role="group" aria-labelledby={`label-char-all-${characteristic.id}`}>
                    {characteristic.characteristics && characteristic.characteristics.map((char) => (
                      <div key={char.id}>
                        <input className='checkmark' type="checkbox" id={`check-${char.id}`} value={`${char.id}`} onChange={saveFilter} />
                        <label className='checkmarkLabel' htmlFor={`check-${char.id}`}>{char.description}</label>
                      </div>
                    ))}
                  </div>
                ) : characteristic.filterType === 'select' ? (
                  // ♿ aria-labelledby conecta el select con su h3
                  <select name={characteristic.id} aria-labelledby={`label-char-all-${characteristic.id}`} onChange={handleSelectChange}>
                    <option value="">Selecciona...</option>
                    {characteristic.characteristic?.map((char) => (
                      <option value={`${char.id}`} key={char.id}>{char.description}</option>
                    ))}
                  </select>
                ) : (
                  <p>No vull fer mes o menys ara</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='searchDisplay'>
          {/* ♿ label oculto + tipo search para el buscador */}
          <label htmlFor="searchInputAll" className="sr-only">Buscar productes</label>
          <input
            id="searchInputAll"
            type="search"
            placeholder='Buscar...'
            aria-label="Buscar productes"
            onChange={(e) => { setSavedText(e.target.value); }}
            onKeyUp={(e) => { searchProductsInStore(e.target.value, savedFilters, dinamicFilters, minPrice, maxPrice); }}
          />

          {/* ♿ aria-live anuncia cambios en resultados a lectores de pantalla */}
          <div
            className='searchDisplayResult'
            aria-live="polite"
            aria-label={`Resultats: ${productsFiltrats.length} productes`}
          >
            {productsFiltrats.map((product) => {
              const estaAñadido = añadidos.has(product.id);
              const estaSinStock = sinStock.has(product.id) || product.stock === 0;
              const discountActive = isDiscountActive(product);
              const finalPrice = getFinalPrice(product);

              return (
                // ♿ role="article" + tabIndex + onKeyDown para navegación por teclado
                <div
                  className="card"
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  role="article"
                  tabIndex={0}
                  aria-label={`Producte: ${product.name}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleProductClick(product.id)}
                >
                  {discountActive ? (
                    <span className="badge-discount" aria-label={`Descompte del ${product.discount_percentage}%`}>
                      -{product.discount_percentage}% DTO
                    </span>
                  ) : product.is_new ? (
                    <span className="badge-new" aria-label="Producte nou">Nou</span>
                  ) : null}

                  <div className="imageContainer" aria-hidden="true">
                    {product.primary_image ? (
                      <img src={`http://localhost:8000/storage/${product.primary_image.path}`} alt={product.name} />
                    ) : (
                      <div className="noImage" aria-hidden="true">No Image</div>
                    )}
                  </div>

                  <div className="info">
                    <span className="cat-label">{product.product_type === "pack" ? "Pack" : product.category.name}</span>
                    <h4>{product.name}</h4>
                    <p className="desc">{product.description}</p>

                    <div className="bottom">
                      <div className="priceGroup">
                        {/* ♿ precios con aria-label para que el lector diga "euros" */}
                        <span className="currentPrice" aria-label={`Preu: ${finalPrice} euros`}>
                          {finalPrice}€
                        </span>
                        {discountActive && (
                          <span className="oldPrice" aria-label={`Preu original: ${parseFloat(product.price).toFixed(2)} euros`}>
                            {parseFloat(product.price).toFixed(2)}€
                          </span>
                        )}
                      </div>

                      {/* ♿ botón con aria-label descriptivo según estado */}
                      <button
                        className={`cartBtn ${estaAñadido ? 'added' : ''} ${estaSinStock ? 'no-stock' : ''}`}
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={estaSinStock}
                        aria-label={
                          estaSinStock
                            ? `${product.name} - Sense estoc`
                            : estaAñadido
                            ? `${product.name} afegit al carret`
                            : `Afegir ${product.name} al carret`
                        }
                        aria-disabled={estaSinStock}
                      >
                        <ShoppingCart size={18} color="white" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default productDisplaySearch;