import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function GeneralProducts({ products, title, columns = 4 }) {
  const navigate = useNavigate();
  const [añadidos, setAñadidos] = useState(new Set());
  const [sinStock, setSinStock]  = useState(new Set());

  if (!products || !products.length) return null;

  const gridColumns = columns === 3 ? 3 : 4;

  const getDiscountedPrice = (price, discount) =>
    (price - (price / 100) * discount).toFixed(2);

  async function handleAddToCart(e, product) {
    e.stopPropagation();

    if (sinStock.has(product.id)) return;

    const unitPrice = parseFloat(
      getDiscountedPrice(product.sale_price, product.discount ?? 0)
    );

    try {
      const response = await fetch('http://localhost:8000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          quantity:   1,
          unit_price: unitPrice,
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

      localStorage.setItem('order_id', data.order_id);

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
    <section className="generalProducts">
      <h2 className="title">{title}</h2>

      <div className="productSection">
        <div className={`productsGrid columns-${gridColumns}`}>
          {products.slice(0, 12).map(product => {
            const estaAñadido  = añadidos.has(product.id);
            const estaSinStock = sinStock.has(product.id) || product.stock === 0;

            return (
              <div
                className="card"
                key={product.id}
                onClick={() => navigate(`/producte/${product.id}`)}
              >
                {product.discount > 0 && (
                  <span className="badge discount">-{product.discount}% DTO</span>
                )}

                <div className="imageContainer">
                  {product.primary_image ? (
                    <img
                      src={`http://localhost:8000/storage/${product.primary_image.path}`}
                      alt={product.name}
                    />
                  ) : (
                    <div className="noImage">No Image</div>
                  )}
                </div>

                <div className="info">
                  <h4>{product.name}</h4>
                  <p className="desc">{product.description}</p>

                  <div className="bottom">
                    <div className="priceGroup">
                      <span className="current-price">
                        {getDiscountedPrice(product.sale_price, product.discount)}€
                      </span>
                      {product.discount > 0 && (
                        <span className="old-price">{product.sale_price} €</span>
                      )}
                    </div>

                    <button
                      className={`cartBtn ${estaAñadido ? 'added' : ''} ${estaSinStock ? 'no-stock' : ''}`}
                      onClick={e => handleAddToCart(e, product)}
                      disabled={estaSinStock}
                    >
                      <ShoppingCart size={20} color="white" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="buttonContainer">
          <button
            className="viewAllButton"
            onClick={() => navigate('/products')}
          >
            Veure tots els productes
          </button>
        </div>
      </div>
    </section>
  );
}

export default GeneralProducts;