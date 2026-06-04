import React from 'react';
import { useRef, useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';

function productCategoryDisplay({ products }) {

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
        <section 
            className='categoryProductDisplay' 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ cursor: isDown ? 'grabbing' : 'grab' }}
            role="region"
            aria-label="Productes destacats"
            tabIndex={0}
        >
            {products.map((product, index) => (
                <div 
                    className='productDisplay' 
                    key={product.id || index}
                    role="article"
                    aria-label={`Producte: ${product.name}`}
                >
                    <div className='productImg' aria-label={`Imatge de ${product.name}`}>
                        {/* Espacio para la imagen */}
                    </div>
                    <div className='productContent'>
                        <div aria-label="Valoració: 5 estrelles">
                            <Star fill='#ffd900' aria-hidden="true" /> 
                            <Star fill='#ffd900' aria-hidden="true" /> 
                            <Star fill='#ffd900' aria-hidden="true" /> 
                            <Star fill='#ffd900' aria-hidden="true" /> 
                            <Star fill='#ffd900' aria-hidden="true" />
                            <span className="sr-only">5 estrelles sobre 5</span>
                        </div>
                        <h4>{product.name}</h4>
                        <p>{product.description}</p>
                        <div className='buyProduct'>
                            <p aria-label={`Preu: ${product.sale_price} euros`}>{product.sale_price}€</p>
                            <ShoppingCart aria-label="Afegir al carretó" />
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default productCategoryDisplay;