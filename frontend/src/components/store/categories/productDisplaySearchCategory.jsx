import React from 'react';
import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';

function productDisplaySearchCategory({ products, characteristics, title }) {

    const [productsFiltrats, setProductsFiltrats] = useState([]);
    const [savedFilters, setSavedFilters] = useState([]);
    const [dinamicFilters, setDinamicFilters] = useState({});
    const [savedText, setSavedText] = useState("");
    const navigate = useNavigate();
    const { refreshCart, updateOrderId } = useCart();

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minWeight, setMinWeight] = useState("");
    const [maxWeight, setMaxWeight] = useState("");

    const [añadidos, setAñadidos] = useState(new Set());
    const [sinStock, setSinStock] = useState(new Set());

    useEffect(() => {
        setProductsFiltrats(products);
    }, [products]);

    const isDiscountActive = (product) => {
        if (!product?.discount_percentage) return false;
        const now = new Date();
        const afterStart = !product.discount_starts_at || new Date(product.discount_starts_at) <= now;
        const beforeEnd  = !product.discount_ends_at   || new Date(product.discount_ends_at)   >= now;
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
        searchProductsInStore(savedText, updatedFilters, dinamicFilters, minPrice, maxPrice, minWeight, maxWeight);
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        let updatedFilters = { ...dinamicFilters, [name]: value };
        if (value === "") delete updatedFilters[name];
        setDinamicFilters(updatedFilters);
        searchProductsInStore(savedText, savedFilters, updatedFilters, minPrice, maxPrice, minWeight, maxWeight);
    };

    const searchProductsInStore = (text = savedText, filters = savedFilters, selectFilters = dinamicFilters, minimumPrice = minPrice, maximumPrice = maxPrice, minimumWeight = minWeight, maximumWeight = maxWeight) => {
        fetch(`http://localhost:8000/api/products/searchProductsInStore`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
                searchText: text,
                filters: filters,
                selectFilters: selectFilters,
                category: title,
                minPrice: minimumPrice,
                maxPrice: maximumPrice,
                minWeight: minimumWeight,
                maxWeight: maximumWeight,
            })
        })
        .then(async response => {
            const data = await response.json();
            if (!response.ok) { console.error("Error del servidor:", data); return; }
            if (data.success) setProductsFiltrats(data.products);
        })
        .catch(error => console.error('Error en la petició:', error));
    };

    async function handleAddToCart(e, product) {
        e.stopPropagation();
        if (sinStock.has(product.id)) return;

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8000/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    product_id: product.id,
                    quantity:   1,
                    order_id:   localStorage.getItem('order_id') ?? null,
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
        <section className='categoryProductDisplay'>

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

                <div className='displayFilters'>
                    <h2>Filtres</h2>
                    <div className="allFilters">

                        <div className="uniqueCharacteristic" key="sale_price">
                            <h3>Preu</h3>
                            <div className="rangeFilter">
                                <input type="number" placeholder="Mínim" min="0" value={minPrice}
                                    onChange={(e) => { setMinPrice(e.target.value); searchProductsInStore(savedText, savedFilters, dinamicFilters, e.target.value, maxPrice, minWeight, maxWeight); }}
                                />€
                                <span className="rangeSeparator">—</span>
                                <input type="number" placeholder="Màxim" min="0" value={maxPrice}
                                    onChange={(e) => { setMaxPrice(e.target.value); searchProductsInStore(savedText, savedFilters, dinamicFilters, minPrice, e.target.value, minWeight, maxWeight); }}
                                />€
                            </div>
                        </div>

                        <div className="uniqueCharacteristic" key="weight">
                            <h3>Pes</h3>
                            <div className="rangeFilter">
                                <input type="number" placeholder="Mínim" min="0" value={minWeight} onChange={(e) => setMinWeight(e.target.value)} />Kg
                                <span className="rangeSeparator">—</span>
                                <input type="number" placeholder="Màxim" min="0" value={maxWeight} onChange={(e) => setMaxWeight(e.target.value)} />Kg
                            </div>
                        </div>

                        {characteristics.map((characteristic) => (
                            <div className="uniqueCharacteristic" key={characteristic.id}>
                                <h3>{characteristic.type}</h3>

                                {characteristic.filterType === 'checkbox' ? (
                                    <div className='checkboxFilter'>
                                        {characteristic.characteristics && characteristic.characteristics.map((char) => (
                                            <div key={char.id}>
                                                <input className='checkmark' type="checkbox" id={`check-${char.id}`} value={`${char.id}`} onChange={saveFilter} />
                                                <label className='checkmarkLabel' htmlFor={`check-${char.id}`}>{char.description}</label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <select name={characteristic.id} onChange={handleSelectChange}>
                                        <option value="">Selecciona...</option>
                                        {characteristic.characteristic?.map((char) => (
                                            <option value={`${char.id}`} key={char.id}>{char.description}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className='searchDisplay'>
                    <input
                        type="text"
                        placeholder={`Buscar ${title}...`}
                        onChange={(e) => setSavedText(e.target.value)}
                        onKeyUp={(e) => searchProductsInStore(e.target.value, savedFilters, dinamicFilters, minPrice, maxPrice, minWeight, maxWeight)}
                    />

                    <div className='searchDisplayResult'>
                        {productsFiltrats.map((product) => {
                            const estaAñadido  = añadidos.has(product.id);
                            const estaSinStock = sinStock.has(product.id) || product.stock === 0;
                            const discountActive = isDiscountActive(product);
                            const finalPrice     = getFinalPrice(product);

                            return (
                                <div className="card" key={product.id} onClick={() => handleProductClick(product.id)}>

                                    {discountActive ? (
                                        <span className="badge-discount">-{product.discount_percentage}% DTO</span>
                                    ) : product.is_new ? (
                                        <span className="badge-new">Nou</span>
                                    ) : null}

                                    <div className="imageContainer">
                                        {product.primary_image ? (
                                            <img src={`http://localhost:8000/storage/${product.primary_image.path}`} alt={product.name} />
                                        ) : (
                                            <div className="noImage">No Image</div>
                                        )}
                                    </div>

                                    <div className="info">
                                        <span className="cat-label">{product.category.name}</span>
                                        <h4>{product.name}</h4>
                                        <p className="desc">{product.description}</p>

                                        <div className="bottom">
                                            <div className="priceGroup">
                                                <span className="currentPrice">{finalPrice}€</span>
                                                {discountActive && (
                                                    <span className="oldPrice">{parseFloat(product.price).toFixed(2)}€</span>
                                                )}
                                            </div>

                                            <button
                                                className={`cartBtn ${estaAñadido ? 'added' : ''} ${estaSinStock ? 'no-stock' : ''}`}
                                                onClick={(e) => handleAddToCart(e, product)}
                                                disabled={estaSinStock}
                                            >
                                                <ShoppingCart size={18} color="white" />
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

export default productDisplaySearchCategory;