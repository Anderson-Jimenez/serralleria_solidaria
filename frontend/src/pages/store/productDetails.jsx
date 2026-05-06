import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Truck, Shield } from 'lucide-react';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity]       = useState(1);

  // Estados del carrito — igual que en los otros componentes
  const [añadido, setAñadido]   = useState(false);
  const [sinStock, setSinStock] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/products/${id}`);
        const data = await response.json();
        const prod = data.product;
        setProduct(prod);

        if (prod?.primaryImage?.path) {
          setSelectedImage(`http://localhost:8000/storage/${prod.primaryImage.path}`);
        } else if (prod?.images?.length > 0) {
          setSelectedImage(`http://localhost:8000/storage/${prod.images[0].path}`);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  async function handleAddToCart() {
    if (sinStock) return;

    const unitPrice = parseFloat(
      (product.sale_price - (product.sale_price / 100) * (product.discount ?? 0)).toFixed(2)
    );

    try {
      const response = await fetch('http://localhost:8000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          quantity,                                        // manda la cantidad seleccionada
          unit_price: unitPrice,
          order_id:   localStorage.getItem('order_id') ?? null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.toLowerCase().includes('stock')) {
          setSinStock(true);
        }
        return;
      }

      localStorage.setItem('order_id', data.order_id);

      // Feedback verde durante 1.5s
      setAñadido(true);
      setTimeout(() => setAñadido(false), 1500);

    } catch (error) {
      console.error('Error carrito:', error);
    }
  }

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loader"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (!product || !product.id) {
    return (
      <div className="product-detail-error">
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate('/')}>Volver a la tienda</button>
      </div>
    );
  }

  const stockAgotado = sinStock || product.stock === 0;

  return (
    <div className="product-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="product-container">
        {/* ── Galería ── */}
        <div className="product-gallery">
          <div className="main-image">
            {selectedImage
              ? <img src={selectedImage} alt={product.name} />
              : <div className="no-image">Sin imagen</div>
            }
          </div>

          {product.images && product.images.length > 1 && (
            <div className="thumbnail-list">
              {product.images.map((image, index) => {
                const imageUrl = `http://localhost:8000/storage/${image.path}`;
                return (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === imageUrl ? 'active' : ''}`}
                    onClick={() => setSelectedImage(imageUrl)}
                  >
                    <img src={imageUrl} alt={`${product.name} ${index}`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="product-info">
          {product.discount > 0 && (
            <span className="discount-badge">-{product.discount}%</span>
          )}

          <h1>{product.name}</h1>

          <div className="price-section">
            <div className="prices">
              <span className="current-price">{product.sale_price}€</span>
              {product.discount > 0 && (
                <span className="old-price">{product.base_price}€</span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="savings">
                Ahorres {((product.base_price - product.sale_price) / product.base_price * 100).toFixed(0)}%
              </span>
            )}
          </div>

          <div className="description">
            <h3>Descripción</h3>
            <p>{product.description}</p>
          </div>

          {product.characteristics && product.characteristics.length > 0 && (
            <div className="characteristics">
              <h3>Característiques</h3>
              <ul>
                {product.characteristics.map((char, index) => (
                  <li key={index}>
                    <strong>{char.name}:</strong> {char.value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="stock-info">
            {stockAgotado ? (
              <span className="out-of-stock">✗ Esgotat</span>
            ) : (
              <span className="in-stock">✓ En stock</span>
            )}
          </div>

          {/* Selector de cantidad — desactivado si no hay stock */}
          <div className="quantity-selector">
            <label>Cantidad:</label>
            <div className="quantity-controls">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || stockAgotado}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock || stockAgotado}
              >
                +
              </button>
            </div>
          </div>

          <button
            className={`add-to-cart ${añadido ? 'added' : ''} ${stockAgotado ? 'no-stock' : ''}`}
            onClick={handleAddToCart}
            disabled={stockAgotado}
          >
            <ShoppingCart size={20} />
            {stockAgotado ? 'Sense stock' : añadido ? 'Afegit!' : 'Afegir al carret'}
          </button>

          <div className="shipping-info">
            <div className="info-item">
              <Truck size={18} />
              <span>Enviament a partir de 9€</span>
            </div>
            <div className="info-item">
              <Shield size={18} />
              <span>Garantia de X anys</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;