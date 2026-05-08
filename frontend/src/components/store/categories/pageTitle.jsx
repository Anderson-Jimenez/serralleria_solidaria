import React from 'react';

function CategoryTitle({ title }) {
  return (
    <section>
      <div className="productsTitle">
        <h1 className='thirdTitle'>{title}</h1>
        <h1 className='secondTitle'>{title}</h1>
        <h1 className='centerTitle'>{title}</h1>
        <h1 className='secondTitle'>{title}</h1>
        <h1 className='thirdTitle'>{title}</h1>
      </div>
      <div className='subPrinciplaPanell'>

      </div>
    </section>
  );
}

export default CategoryTitle;