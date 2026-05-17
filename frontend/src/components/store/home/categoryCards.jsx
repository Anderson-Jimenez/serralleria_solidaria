import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, KeyRound, Package } from 'lucide-react';

function CategoryCards() {
  const navigate = useNavigate();

  return (
    <section className="categoryCards">

      <div className="categoryHeader">
        <span className="categorySubtitle">EL NOSTRE CATÀLEG</span>
        <h2 className="categoryTitle">
          EXPLORA PER <span>CATEGORIA</span>
        </h2>
      </div>

      <div className="categoryGrid">

        <div className="categoryItem teal" onClick={() => navigate('/productes')}>
          <div className="categoryIcon">
            <KeyRound size={44} strokeWidth={1.3} />
          </div>
          <div className="categoryInfo">
            <span className="categoryLabel">Seguretat</span>
            <h3 className="categoryName">Cilindres</h3>
            <p className="categoryDesc">Alta resistència al punxament i al gir per a portes d'entrada.</p>
          </div>
          <span className="categoryCta">Veure productes →</span>
        </div>

        <div className="categoryItem blue" onClick={() => navigate('/productes')}>
          <div className="categoryIcon">
            <ShieldCheck size={44} strokeWidth={1.3} />
          </div>
          <div className="categoryInfo">
            <span className="categoryLabel">Protecció</span>
            <h3 className="categoryName">Escuts</h3>
            <p className="categoryDesc">Plaques anti-taladre per reforçar l'entorn del pany.</p>
          </div>
          <span className="categoryCta">Veure productes →</span>
        </div>

        <div className="categoryItem amber" onClick={() => navigate('/productes')}>
          <div className="categoryIcon">
            <Lock size={44} strokeWidth={1.3} />
          </div>
          <div className="categoryInfo">
            <span className="categoryLabel">Doble tancament</span>
            <h3 className="categoryName">Segon Pany</h3>
            <p className="categoryDesc">Afegeix una segona capa de seguretat a la teva porta principal.</p>
          </div>
          <span className="categoryCta">Veure productes →</span>
        </div>

      </div>

      <div className="packBanner" onClick={() => navigate('/productes')}>
        <div className="packIcon">
          <Package size={52} strokeWidth={1.2} />
        </div>
        <div className="packInfo">
          <span className="categoryLabel">Oferta especial</span>
          <h3 className="packName">Packs de Productes</h3>
          <p className="packDesc">Combina cilindre + escut + segon pany al millor preu. Solucions completes per a cada tipus de porta.</p>
          <span className="categoryCta">Descobrir packs →</span>
        </div>
        <span className="packBadge">NOU</span>
      </div>

    </section>
  );
}

export default CategoryCards;