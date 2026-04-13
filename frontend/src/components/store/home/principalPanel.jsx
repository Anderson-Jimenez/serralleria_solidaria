import React from 'react';
import { useNavigate } from 'react-router-dom';

function principalPanell() {
  const navigate = useNavigate();
  
  return (
    <section className="principalPanell">
      <div className="container">
        <div className="principalPanellContent">
          <h1>Seguretat i Confiança per a la teva Llar</h1>
          <p>
            Especialistes en serralleria amb més de 25 anys d'experiència. Productes de màxima qualitat i servei professional.
          </p>
          <div className="principalContentActions">
            <button className="seeProducts" onClick={() => navigate('/products')}>Veure Productes</button>
            <button className="contactUs" onClick={() => navigate('/solucions_personalitzades')}>Contacta'ns</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default principalPanell;