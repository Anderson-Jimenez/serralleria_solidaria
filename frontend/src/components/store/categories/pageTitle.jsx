import React from 'react';

function CategoryTitle({ title }) {
  return (
    <section aria-label={`Categoria: ${title}`}>
      <div className="productsTitle">
        <h1 className='thirdTitle'    aria-hidden="true">{title}</h1>
        <h1 className='secondTitle'   aria-hidden="true">{title}</h1>
        <h1 className='centerTitle'>{title}</h1>  {/* ← solo este es real */}
        <h1 className='secondTitle'   aria-hidden="true">{title}</h1>
        <h1 className='thirdTitle'    aria-hidden="true">{title}</h1>
      </div>
      <div className='subPrinciplaPanell'></div>
    </section>
  );
}

export default CategoryTitle;