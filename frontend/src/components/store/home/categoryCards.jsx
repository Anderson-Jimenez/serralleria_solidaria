import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, KeyRound, Package } from 'lucide-react';

function CategoryCards() {
  const navigate = useNavigate();

  return (
    <section className="categoryCards">

      <div className="categorySelectionHeader">
        <span className="categorySelectionLabel">EL NOSTRE CATÀLEG</span>
        <h1 className='categorySelectionTitle'>El nostre <span>Cataleg</span></h1>
        <div className='categorySelectionDivider' />
      </div>

      <div className="categoryGrid">
        <div className="categorySelectionCategory" onClick={() => navigate('/products/Cilindres')}>
          <div className="categoryLeft">
            <KeyRound size={36} strokeWidth={1.3} />
            <div className="categoryText">
              <span>Seguretat</span>
              <h2>Cilindres</h2>
              <p>Alta resistència al punxament i al gir per a portes d'entrada.</p>
              <span className="categoryCta">Veure productes →</span>
            </div>
          </div>
          <div className="categoryRight">
            <span className="categoryNumber">01</span>
          </div>
        </div>

        <div className="categorySelectionCategory" onClick={() => navigate('/products/Escut')}>
          <div className="categoryLeft">
            <ShieldCheck size={36} strokeWidth={1.3} />
            <div className="categoryText">
              <span>Protecció</span>
              <h2>Escuts</h2>
              <p>Plaques anti-taladre per reforçar l'entorn del pany.</p>
              <span className="categoryCta">Veure productes →</span>
            </div>
          </div>
          <div className="categoryRight">
            <span className="categoryNumber">02</span>
          </div>
        </div>

        <div className="categorySelectionCategory" onClick={() => navigate('/products/Segon Pany')}>
          <div className="categoryLeft">
            <Lock size={36} strokeWidth={1.3} />
            <div className="categoryText">
              <span>Doble tancament</span>
              <h2>Segon Pany</h2>
              <p>Afegeix una segona capa de seguretat a la teva porta principal.</p>
              <span className="categoryCta">Veure productes →</span>
            </div>
          </div>
          <div className="categoryRight">
            <span className="categoryNumber">03</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryCards;