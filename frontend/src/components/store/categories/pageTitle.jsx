import React from 'react';

function CategoryTitle({ title }) {
  return (
    <section className="ct">

      {/* SVG únic de fons amb tots els elements geomètrics */}
      <svg
        className="ct__bg"
        viewBox="0 0 1200 200"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* ── ZONA ESQUERRA ────────────────────────────────── */}

        {/* Cercle gran — ancle visual esquerra */}
        <circle cx="130" cy="100" r="88"  stroke="#FF5A1F" strokeWidth="1.2" opacity="0.22"/>
        <circle cx="130" cy="100" r="58"  stroke="#FF5A1F" strokeWidth="0.7" strokeDasharray="6 5" opacity="0.14"/>

        {/* Quadrat rotat */}
        <rect x="58" y="28" width="72" height="72"
          stroke="#FF5A1F" strokeWidth="1.2" opacity="0.16"
          transform="rotate(45 94 64)"/>

        {/* Línia horitzontal esquerra amb tall */}
        <line x1="0"   y1="148" x2="240" y2="148" stroke="#FF5A1F" strokeWidth="0.8" opacity="0.18"/>
        <line x1="0"   y1="154" x2="180" y2="154" stroke="#FF5A1F" strokeWidth="0.4" opacity="0.10"/>

        {/* Grid de punts */}
        {[0,1,2,3,4].map(r => [0,1,2,3].map(c => (
          <circle key={`d-${r}-${c}`}
            cx={260 + c * 18} cy={30 + r * 18}
            r="1.8" fill="#FF5A1F" opacity="0.18"/>
        )))}

        {/* Triangle petit */}
        <polygon points="50,172 82,172 66,144"
          stroke="#FF5A1F" strokeWidth="1" opacity="0.18" fill="none"/>

        {/* ── ZONA DRETA ───────────────────────────────────── */}

        {/* Hexàgon gran */}
        <polygon
          points="1110,18 1158,44 1158,156 1110,182 1062,156 1062,44"
          stroke="#FF5A1F" strokeWidth="1.2" opacity="0.20" fill="none"/>
        <polygon
          points="1110,36 1140,52 1140,148 1110,164 1080,148 1080,52"
          stroke="#FF5A1F" strokeWidth="0.6" strokeDasharray="5 4" opacity="0.12" fill="none"/>

        {/* Cercle petit amb nucli */}
        <circle cx="1040" cy="56"  r="32" stroke="#FF5A1F" strokeWidth="1.2" opacity="0.20"/>
        <circle cx="1040" cy="56"  r="10" fill="#FF5A1F" opacity="0.12"/>

        {/* Creu */}
        <line x1="980" y1="120" x2="980" y2="186" stroke="#FF5A1F" strokeWidth="1.2" opacity="0.18"/>
        <line x1="947" y1="153" x2="1013" y2="153" stroke="#FF5A1F" strokeWidth="1.2" opacity="0.18"/>
        <line x1="980" y1="128" x2="980" y2="178" stroke="#FF5A1F" strokeWidth="0.5" opacity="0.10"/>
        <line x1="955" y1="153" x2="1005" y2="153" stroke="#FF5A1F" strokeWidth="0.5" opacity="0.10"/>

        {/* Línia horitzontal dreta */}
        <line x1="960"  y1="52" x2="1200" y2="52" stroke="#FF5A1F" strokeWidth="0.8" opacity="0.18"/>
        <line x1="1020" y1="58" x2="1200" y2="58" stroke="#FF5A1F" strokeWidth="0.4" opacity="0.10"/>

        {/* Grid de punts dreta */}
        {[0,1,2,3,4].map(r => [0,1,2,3].map(c => (
          <circle key={`dr-${r}-${c}`}
            cx={920 + c * 18} cy={30 + r * 18}
            r="1.8" fill="#FF5A1F" opacity="0.18"/>
        )))}
      </svg>

      {/* ── Contingut central ── */}
      <div className="ct__inner">
        <h2 className="ct__ghost" aria-hidden="true">{title}</h2>
        <div className="ct__fore">
          <span className="ct__line" />
          <h1 className="ct__main">{title}</h1>
          <span className="ct__line ct__line--rev" />
        </div>
      </div>

    </section>
  );
}

export default CategoryTitle;