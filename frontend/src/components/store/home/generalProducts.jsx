import React, { useState } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function GeneralProducts({ products, title, columns = 4 }) {
  const navigate = useNavigate();
  
  if (!products || !products.length) return null;

  const handleProductClick = (productId) => {
    navigate(`/producte/${productId}`);
  };

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  const gridColumns = columns === 3 ? 3 : 4;

  return (
    <section className="generalProducts">
      <h2 className="title">{title}</h2>
      <div className="productSection">
        <div className={`productsGrid columns-${gridColumns}`}>
          {products.slice(0, 12).map((product) => (
            <div className="card" key={product.id} onClick={() => handleProductClick(product.id)}>
              {product.discount > 0 && (
                <span className="badge discount">-{product.discount}% DTO</span>
              )}

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
                    <span className="current-price">{(product.sale_price - (product.sale_price/100 *product.discount)).toFixed(2)}€</span>
                    {product.discount > 0 && <span className="old-price">{product.sale_price} €</span>}
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
        
        <div className="buttonContainer">
          <button className="viewAllButton" onClick={handleViewAllProducts}>
            Veure tots els productes
          </button>
        </div>
      </div>
    </section>
  );
}

export default GeneralProducts;