import React from 'react';
import { useRef, useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';

function productCategoryDisplayAll({ products }) {

    return (
        <section id='categoryProductDisplayAll' className='categoryProductDisplay'>
            <div className='displayFilters'>
                <h2>Filtres</h2>
            </div>
            <div className='searchDisplay'>
                <input type="text" placeholder='Buscar Escuts...'/>
                <div className='searchDisplayResult'>
                    {products.map((product) => (
                        <div className='productDisplay'>
                            <div className='productImg'>
                            
                            </div>
                            <div className='productContent'>
                                <div><Star fill='#ffd900' /> <Star fill='#ffd900' /> <Star fill='#ffd900' /> <Star fill='#ffd900' /> <Star fill='#ffd900' /></div>
                                <h4>{product.name}</h4>
                                <p>{product.description}</p>
                                <div className='buyProduct'>
                                    <p>{product.sale_price}€</p>
                                    <ShoppingCart />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default productCategoryDisplayAll;