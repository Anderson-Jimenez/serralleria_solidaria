import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';

function FeaturedProducts({ products, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [añadidos, setAñadidos] = useState(new Set());
  const [sinStock, setSinStock] = useState(new Set());
  const { refreshCart, updateOrderId } = useCart(); // ← Obtiene funciones del contexto

  if (!products || !products.length) return null;

  const heroProduct      = products[0];
  const carouselProducts = products.slice(1);
  const itemsPerPage     = 4;
  const maxIndex         = Math.max(0, carouselProducts.length - itemsPerPage);

  const nextSlide = () => setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

  const isDiscountActive = (product) => {
    if (!product.discount_percentage) return false;
    const now = new Date();
    const afterStart = !product.discount_starts_at || new Date(product.discount_starts_at) <= now;
    const beforeEnd  = !product.discount_ends_at   || new Date(product.discount_ends_at)   >= now;
    return afterStart && beforeEnd;
  };

  const getDiscountedPrice = (price, product) => {
    if (!isDiscountActive(product)) return parseFloat(price).toFixed(2);
    return (price - (price / 100) * product.discount_percentage).toFixed(2);
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

      // Feedback visual: mostrar "añadido"
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

  function CartButton({ product, className }) {
    const estaAñadido  = añadidos.has(product.id);
    const estaSinStock = sinStock.has(product.id) || product.stock === 0;

    return (
      <button
        className={`${className} ${estaAñadido ? 'added' : ''} ${estaSinStock ? 'no-stock' : ''}`}
        onClick={e => handleAddToCart(e, product)}
        disabled={estaSinStock}
      >
        <ShoppingCart size={18} color="white" />
      </button>
    );
  }

  return (
    <section className="featured-layout">
      <div className="section-header">
        <div className="title-group">
          <span className="subtitle">SELECCIÓ DE L'EDITOR</span>
          <h2 className="main-title">
            {title || 'PRODUCTES'}
            <br />
            <span>DESTACATS</span>
          </h2>
        </div>
      </div>

      <div className="grid-container">
        <div
          className="hero-card"
          onClick={() => navigate(`/producte/${heroProduct.id}`)}
        >
          <span className="badge-hero">EL MÉS VENUT</span>

          {isDiscountActive(heroProduct) && (
            <span className="badge-discount badge-discount--hero">
              -{heroProduct.discount_percentage}% DTO
            </span>
          )}

          <div className="hero-image">
            <img
              src={`http://localhost:8000/storage/${heroProduct.primary_image?.path}`}
              alt={heroProduct.name}
            />
          </div>

          <div className="hero-info">
            <h3 className="hero-name">{heroProduct.name}</h3>
            <p className="hero-desc">{heroProduct.description}</p>

            <div className="hero-price-row">
              <span className="current-price">
                {getDiscountedPrice(heroProduct.price, heroProduct)}€
              </span>
              {isDiscountActive(heroProduct) && (
                <span className="old-price">{heroProduct.price} €</span>
              )}
            </div>
          </div>
        </div>

        <div className="carousel-side">
          <div className="carousel-controls">
            <button onClick={prevSlide} disabled={currentIndex === 0}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} disabled={currentIndex === maxIndex}>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="carousel-viewport">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentIndex * (100 / 2)}%)` }}
            >
              {carouselProducts.map(product => (
                <div
                  className="small-card"
                  key={product.id}
                  onClick={() => navigate(`/producte/${product.id}`)}
                >
                  {isDiscountActive(product) && (
                    <span className="badge discount">-{product.discount_percentage}% DTO</span>
                  )}

                  <div className="small-image">
                    <img
                      src={`http://localhost:8000/storage/${product.primary_image?.path}`}
                      alt={product.name}
                    />
                  </div>

                  <div className="small-info">
                    <span className="small-cat">CATEGORIA</span>
                    <h4 className="small-name">{product.name}</h4>
                    <p className="small-desc">{product.description}</p>

                    <div className="small-bottom">
                      <div className="small-price-group">
                        <span className="small-price">
                          {getDiscountedPrice(product.price, product)}€
                        </span>
                        {isDiscountActive(product) && (
                          <span className="small-old-price">{product.price}€</span>
                        )}
                      </div>

                      <CartButton product={product} className="small-cart-btn" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;