import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Truck, Shield, Zap } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshCart, updateOrderId } = useCart(); // ← Funciones del contexto

  const [product, setProduct]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity]           = useState(1);

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

  async function handleAddToCart() {
    if (sinStock) return;

    try {
      const response = await fetch('http://localhost:8000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
          order_id: localStorage.getItem('order_id') ?? null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.toLowerCase().includes('stock')) {
          setSinStock(true);
        }
        return;
      }

      if (data.order_id) {
        updateOrderId(data.order_id);
      } else {
        refreshCart();
      }

      // 🔥 Disparar evento por si otros componentes lo escuchan
      window.dispatchEvent(new Event('cart-updated'));

      // Feedback visual
      setAñadido(true);
      setTimeout(() => setAñadido(false), 1500);
    } catch (error) {
      console.error('Error carrito:', error);
    }
  }

  async function handleBuyNow() {
    await handleAddToCart();
    navigate('/cart');
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

  const stockAgotado    = sinStock || product.stock === 0;
  const discountActive  = isDiscountActive(product);
  const finalPrice      = getFinalPrice(product);

  return (
    <div className="product-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="product-container">
        {/* Galería */}
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

        {/* Info */}
        <div className="product-info">
          <h1>{product.name}</h1>

          <div className="price-section">
            <div className="prices">
              <span className="current-price">{finalPrice}€</span>
              {discountActive && (
                <span className="old-price">{parseFloat(product.price).toFixed(2)}€</span>
              )}
            </div>
            {discountActive && (
              <span className="savings">
                Estalvies {product.discount_percentage}%
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

          {/* Botones agrupados */}
          <div className="action-buttons">
            <button
              className={`add-to-cart ${añadido ? 'added' : ''} ${stockAgotado ? 'no-stock' : ''}`}
              onClick={handleAddToCart}
              disabled={stockAgotado}
            >
              <ShoppingCart size={20} />
              {stockAgotado ? 'Sense stock' : añadido ? 'Afegit!' : 'Afegir al carret'}
            </button>

            <button
              className={`buy-now ${stockAgotado ? 'no-stock' : ''}`}
              onClick={handleBuyNow}
              disabled={stockAgotado}
            >
              <Zap size={16} />
              Comprar ara
            </button>
          </div>

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