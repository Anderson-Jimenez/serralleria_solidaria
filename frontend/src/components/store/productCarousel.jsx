import React, { useEffect, useRef, useState } from 'react';

// Substitueix per les teves imatges reals
const ITEMS = [
  { id: 1, src: '../../../public/images/locksmithWork.jpg', label: 'Professionalitat' },
  { id: 2, src: '../../../public/images/safteyLock.jpg', label: 'Seguretat' },
  { id: 3, src: '../../../public/images/safteyKey.jpg', label: 'Confiança' },
  { id: 4, src: '../../../public/images/oldKeys.jpg', label: 'Solidaritat' },
  { id: 5, src: '../../../public/images/prices.jpg', label: 'Preus Justos' },
];

const TOTAL   = ITEMS.length;
const DELAY   = 4000;   // ms entre cada gir automàtic
const DEG     = 360 / TOTAL;

export default function ProductCarousel() {
  const [active, setActive]   = useState(0);
  const [paused, setPaused]   = useState(false);
  const intervalRef           = useRef(null);

  const advance = (dir = 1) => setActive(prev => (prev + dir + TOTAL) % TOTAL);

  // Gir automàtic
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => advance(1), DELAY);
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  return (
    <div
      className="pc"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Decoració de fons */}
      <div className="pc__ring pc__ring--1" />
      <div className="pc__ring pc__ring--2" />
      <div className="pc__ring pc__ring--3" />

      {/* Cartes */}
      <div className="pc__stage">
        {ITEMS.map((item, i) => {
          const offset = i - active;
          // Normalitza l'offset perquè sempre estigui entre -floor i +ceil
          const norm =
            offset > Math.floor(TOTAL / 2)
              ? offset - TOTAL
              : offset < -Math.floor(TOTAL / 2)
              ? offset + TOTAL
              : offset;

          const isActive = norm === 0;
          const isPrev   = norm === -1;
          const isNext   = norm === 1;
          const visible  = Math.abs(norm) <= 1;

          return (
            <div
              key={item.id}
              className={[
                'pc__card',
                isActive ? 'pc__card--active'  : '',
                isPrev   ? 'pc__card--prev'    : '',
                isNext   ? 'pc__card--next'    : '',
                !visible ? 'pc__card--hidden'  : '',
              ].join(' ')}
              onClick={() => !isActive && setActive(i)}
            >
              <div className="pc__card-img">
                <img src={item.src} alt={item.label} />
                <div className="pc__card-overlay" />
              </div>
              <span className="pc__card-label">{item.label}</span>
              {isActive && <span className="pc__card-accent" />}
            </div>
          );
        })}
      </div>

      {/* Indicadors */}
      <div className="pc__dots">
        {ITEMS.map((_, i) => (
          <button
            key={i}
            className={`pc__dot${i === active ? ' pc__dot--on' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Producte ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}