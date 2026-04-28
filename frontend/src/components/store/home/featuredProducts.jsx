import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function FeaturedProducts({ products, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  if (!products || !products.length) return null;

  const heroProduct = products[0];
  const carouselProducts = products.slice(1);
  const itemsPerPage = 4;
  const maxIndex = Math.max(0, carouselProducts.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const getDiscountedPrice = (price, discount) => {
    return (price - (price / 100) * discount).toFixed(2);
  };
  const handleAddToCart = (product) => {
    console.log('Añadir al carrito:', product.id);
  };

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
          <span className="badge-hero">
            EL MÉS VENUT
          </span>

          {heroProduct.discount > 0 && (
            <span className="badge-discount badge-discount--hero">
              -{heroProduct.discount}% DTO
            </span>
          )}
          <div className="hero-image">
            <img
              src={`http://localhost:8000/storage/${heroProduct.primary_image?.path}`}
              alt={heroProduct.name}
            />
          </div>

          <div className="hero-info">
            <h3 className="hero-name">
              {heroProduct.name}
            </h3>

            <p className="hero-desc">
              {heroProduct.description}
            </p>

            <div className="hero-price-row">
              <span className="current-price">
                {getDiscountedPrice(
                  heroProduct.sale_price,
                  heroProduct.discount
                )}
                €
              </span>

              {heroProduct.discount > 0 && (
                <span className="old-price">
                  {heroProduct.sale_price} €
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="carousel-side">
          <div className="carousel-controls">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="carousel-viewport">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / 2)
                }%)`,
              }}
            >
              {carouselProducts.map((product) => (
                <div className="small-card" key={product.id} onClick={() => navigate(`/producte/${product.id}`)}>
                  {product.discount > 0 && (
                    <span className="badge discount">
                      -{product.discount}% DTO
                    </span>
                  )}

                  <div className="small-image">
                    <img src={`http://localhost:8000/storage/${product.primary_image?.path}`} alt={product.name} /> 
                  </div>

                  <div className="small-info">
                    <span className="small-cat">
                      CATEGORIA
                    </span>

                    <h4 className="small-name">
                      {product.name}
                    </h4>

                    <p className="small-desc">
                      {product.description}
                    </p>

                    <div className="small-bottom">
                      <div className="small-price-group">
                        <span className="small-price">
                          {product.discount > 0
                            ? `${getDiscountedPrice(
                                product.sale_price,
                                product.discount
                              )}€`
                            : `${product.sale_price}€`}
                        </span>

                        {product.discount > 0 && (
                          <span className="small-old-price">
                            {product.sale_price}€
                          </span>
                        )}
                      </div>
                        <button
                          className="small-cart-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart
                            size={18}
                            color="white"
                          />
                        </button>
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