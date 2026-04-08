import React, { useState } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function GeneralProducts({ products, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const itemsPerPage = 4;
  
  if (!products || !products.length) return null;

  const maxIndex = products.length - itemsPerPage;
  
  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };
  
  const handleProductClick = (productId) => {
    navigate(`/producte/${productId}`);
  };

  return (
    <section className="generalProducts">
      <h2 className="title">{title}</h2>
      
      <div className="carousel-container">
        <button 
          className="carousel-btn prev" 
          onClick={prevSlide}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="carousel-wrapper">
          <div 
            className="carousel-track"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
          >
            {products.map((product) => (
              <div 
                className="card" 
                key={product.id}
                onClick={() => handleProductClick(product.id)}
              >
                {product.discount > 0 ? (
                  <span className="badge discount">-{product.discount}%</span>
                ) : product.is_new ? (
                  <span className="badge new">Nou</span>
                ) : null}
                
                <div className="imageContainer">
                  {product.primary_image ? (
                    <img src={`http://localhost:8000/storage/${product.primary_image.path}`} alt={product.name} />
                  ) : (
                    <div className="noImage">No Image</div>
                  )}
                </div>
                
                <div className="info">
                  <h4>{product.name}</h4>
                  <p className="desc">{product.description}</p>
                  
                  <div className="bottom">
                    <div className="priceGroup">
                      <span className="currentPrice">{product.sale_price}€</span>
                      {product.discount > 0 && <span className="oldPrice">{product.base_price}€</span>}
                    </div>
                    
                    <button 
                      className="cartBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <ShoppingCart size={20} color="white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          className="carousel-btn next" 
          onClick={nextSlide}
          disabled={currentIndex === maxIndex}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}

export default GeneralProducts;