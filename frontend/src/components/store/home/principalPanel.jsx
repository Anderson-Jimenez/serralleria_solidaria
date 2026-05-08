import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCarousel from '../../store/productCarousel';

function principalPanell() {
  const navigate = useNavigate();

  return (
    <section className="principalPanell">
      <div className="container">
        <div className="principalPanellContent">
          <div className='leftPrincipalPanell'>
            <span>Serralleria Solidaria</span>
            <h1>Seguretat i Confiança <br /> per a la teva Llar</h1>
            <p>
              Professionals qualificats al teu servei <br />Materials d'alta qualitat. Adaptats al vostre pressupost i necessitats.
            </p>
            <div className="principalContentActions">
              <button className="seeProducts" onClick={() => navigate('/products')}>Veure Productes</button>
              <button className="contactUs" onClick={() => navigate('/solucions_personalitzades')}>Contacta'ns</button>
            </div>
          </div>
          <div className='rightPrincipalPanell'>
            <ProductCarousel />
          </div>
        </div>
      </div>
      

      <div className='subPrinciplaPanell'>
        <div className='subPrinciplaPanellCategories'>
          <p>Cat 1</p>
          <p>Cat 2</p>
          <p>Cat 3</p>
          <p>Cat 4</p>
        </div>
        <p className='deliveryInfo'> - Informació d'entregas</p>
      </div>
    </section>
  );
}

export default principalPanell;