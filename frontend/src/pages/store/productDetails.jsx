import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Truck, Shield } from 'lucide-react';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://localhost:8000/api/products/${id}`);
        const data = await response.json();

        console.log("API response:", data);

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

  const handleAddToCart = () => {
    console.log('Añadir al carrito:', product.id, quantity);
  };

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
        <button onClick={() => navigate('/')}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Volver
      </button>
      <div className="product-container">
        <div className="product-gallery">
          <div className="main-image">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} />
            ) : (
              <div className="no-image">Sin imagen</div>
            )}
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

          {/* DESCRIPCIÓN */}
          <div className="description">
            <h3>Descripción</h3>
            <p>{product.description}</p>
          </div>

          {/* CARACTERÍSTICAS */}
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

          {/* STOCK */}
          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">
                ✓ En stock ({product.stock} unitats)
              </span>
            ) : (
              <span className="out-of-stock">
                ✗ Esgotat
              </span>
            )}
          </div>

          <div className="quantity-selector">
            <label>Cantidad:</label>

            <div className="quantity-controls">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <button
            className="add-to-cart"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart size={20} />
            Añadir al carrito
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