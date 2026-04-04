import React from 'react';
import { useRef, useState } from 'react';
import { Star,ShoppingCart } from 'lucide-react';

function productCategoryDisplay({products}) {

    /* Agraeixo a gemini ai per ajudarme a fer aixo perque no tinc ni idea si no*/
    /* Aixo fa que la barra de productes sigui draggable*/

    const scrollRef = useRef(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsDown(true);
        // Guardem la posició inicial del ratolí i de l'scroll
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => setIsDown(false);
    const handleMouseUp = () => setIsDown(false);

    const handleMouseMove = (e) => {
        if (!isDown) return; // Si no estem clicant, no fem res
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Multiplica per la velocitat de l'arrossegament
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

  return (
    
    <section className='categoryProductDisplay' ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ cursor: isDown ? 'grabbing' : 'grab' }}>
        {products.map((product) => (
            <div className='productDisplay'>
                <div className='productImg'>
                    
                </div>
                <div className='productContent'>
                    <div><Star fill='#ffd900'/> <Star fill='#ffd900'/> <Star fill='#ffd900'/> <Star fill='#ffd900'/> <Star fill='#ffd900'/></div>
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                    <div className='buyProduct'>
                        <p>{product.sale_price}€</p>
                        <ShoppingCart />
                    </div>
                </div>
            </div>
        ))}

    </section>
  );
}

export default productCategoryDisplay;