import React from 'react';
import { useRef, useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';

function productCategoryDisplay({ products }) {

    const scrollRef = useRef(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsDown(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => setIsDown(false);
    const handleMouseUp = () => setIsDown(false);

    const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        // ♿ role="region" + aria-label identifica la sección
        // ♿ aria-roledescription explica que es una lista deslizable
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
        >
            {products.map((product) => (
                // ♿ key obligatorio + role="article" para cada producto
                <div className='productDisplay' key={product.id} role="article" aria-label={`Producte: ${product.name}`}>
                    <div className='productImg'>
                        {/* ♿ si no hay imagen, el div vacío se oculta a lectores */}
                        <span aria-hidden="true"></span>
                    </div>
                    <div className='productContent'>
                        {/* ♿ Las 5 estrellas decorativas se agrupan con un aria-label descriptivo
                            y cada icono individual se oculta con aria-hidden */}
                        <div aria-label="Valoració: 5 estrelles de 5">
                            <Star fill='#ffd900' aria-hidden="true" />
                            <Star fill='#ffd900' aria-hidden="true" />
                            <Star fill='#ffd900' aria-hidden="true" />
                            <Star fill='#ffd900' aria-hidden="true" />
                            <Star fill='#ffd900' aria-hidden="true" />
                        </div>
                        <h4>{product.name}</h4>
                        <p>{product.description}</p>
                        <div className='buyProduct'>
                            {/* ♿ precio con aria-label legible */}
                            <p aria-label={`Preu: ${product.sale_price} euros`}>
                                {product.sale_price}€
                            </p>
                            {/* ♿ botón con aria-label descriptivo en vez de solo icono */}
                            <button aria-label={`Afegir ${product.name} al carret`}>
                                <ShoppingCart aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default productCategoryDisplay;