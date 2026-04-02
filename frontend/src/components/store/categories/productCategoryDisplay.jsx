import React from 'react';


function productCategoryDisplay({products}) {
  return (
    
    <section className='categoryProductDisplay'>
        {products.map((product) => (
            <div className='productDisplay'>
                <div className='productImg'>
                    <p>Imatge Prod</p>
                </div>
                <div className='productContent'>
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                    <p className='productPrice'>{product.sale_price}</p>
                </div>
            </div>
        ))}

    </section>
  );
}

export default productCategoryDisplay;