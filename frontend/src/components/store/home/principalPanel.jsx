import React from 'react';
import { useNavigate } from 'react-router-dom';

function principalPanell() {
  const navigate = useNavigate();
  
  return (
    <section className="principalPanell">
      <div className="container">
        <div className="principalPanellContent">
          <span>Serralleria Solidaria</span>
          <h1>Seguretat i Confiança <br /> per a la teva Llar</h1>
          <p>
            Especialistes en serralleria amb més de 25 anys d'experiència. Productes de màxima qualitat i servei professional.
          </p>
          <div className="principalContentActions">
            <button className="seeProducts" onClick={() => navigate('/products')}>Veure Productes</button>
            <button className="contactUs" onClick={() => navigate('/solucions_personalitzades')}>Contacta'ns</button>
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