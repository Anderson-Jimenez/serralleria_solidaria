import React, { useRef, useEffect } from 'react';

const GraficLiniaVendes = ({ dades }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Configuració general
    const padding = 40; // Més padding per eixos i etiquetes
    const ampleReal = canvas.width - padding * 2;
    const alcadaReal = canvas.height - padding * 2;
    const valors = dades.map(d => d.valor);
    const maxValorDades = 100; // Definim el màxim visible a l'eix (com '20k+', deixem espai)
    
    // Netegem
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- 1. DIBUIXAR GRID I EIXOS ---
    ctx.strokeStyle = '#f1f1f1'; // Color molt suau per a la quadrícula
    ctx.lineWidth = 1;
    ctx.font = '12px Inter, Arial, sans-serif';
    ctx.fillStyle = '#666'; // Color gris per al text
    ctx.textAlign = 'right';

    const liniesGrid = 5; // 0, 5k, 10k, 15k, 20k
    for (let i = 0; i < liniesGrid; i++) {
      const yLabel = (i * maxValorDades) / (liniesGrid - 1);
      const yPos = (canvas.height - padding) - (yLabel / maxValorDades) * alcadaReal;
      
      // Línia de quadrícula
      ctx.beginPath();
      ctx.moveTo(padding, yPos);
      ctx.lineTo(canvas.width - padding, yPos);
      ctx.stroke();

      // Etiqueta Eix Y (ex: 20k, 15k)
      let textEtiqueta = yLabel === 0 ? '0' : `${yLabel}`;
      // Corregim el format per a nombres enters o decimals nets
      if (yLabel > 0 && yLabel % 1 === 0) {
        textEtiqueta = `${Math.floor(yLabel)}`;
      } else if (yLabel > 0) {
        textEtiqueta = `${yLabel.toFixed(1)}`;
      }
      ctx.fillText(textEtiqueta, padding - 15, yPos + 4);
    }

    // --- 2. CALCULAR COORDENADES DELS PUNTS ---
    const punts = dades.map((d, i) => {
      const x = padding + (i / (dades.length - 1)) * ampleReal;
      const y = (canvas.height - padding) - (d.valor / maxValorDades) * alcadaReal;
      return { x, y, mes: d.mes };
    });

    // --- 3. DIBUIXAR L'ÀREA DE FARCI SUBTIL (El Gradient) ---
    // Creem un gradient lineal des d'on hi ha la línia cap avall
    const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    gradient.addColorStop(0, 'rgba(255, 120, 60, 0.15)'); // Taronja molt suau a dalt
    gradient.addColorStop(0.6, 'rgba(255, 120, 60, 0.03)'); // Gairebé transparent a mig camí
    gradient.addColorStop(1, 'rgba(255, 120, 60, 0.005)'); // Completament transparent a la base

    ctx.fillStyle = gradient;
    ctx.beginPath();
    // Comencem a la base esquerra
    ctx.moveTo(punts[0].x, canvas.height - padding);
    // Recorrem tots els punts per a la part superior de l'àrea
    punts.forEach(p => ctx.lineTo(p.x, p.y));
    // Tanquem a la base dreta i tornem a la base esquerra
    ctx.lineTo(punts[punts.length - 1].x, canvas.height - padding);
    ctx.closePath();
    ctx.fill();

    // --- 4. DIBUIXAR LA LÍNIA TARONJA ---
    ctx.strokeStyle = '#ff6b35'; // Taronja forta com el de la imatge
    ctx.lineWidth = 3;
    ctx.lineCap = 'round'; // Punts rodons per a millor aspecte
    ctx.lineJoin = 'round'; // Angles rodons

    ctx.beginPath();
    punts.forEach((p, i) => {
      if (i === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        ctx.lineTo(p.x, p.y);
      }
    });
    ctx.stroke();

    // --- 5. DIBUIXAR ETIQUETES EIX X (Els mesos) ---
    ctx.textAlign = 'center';
    ctx.fillStyle = '#666';
    punts.forEach(p => {
      ctx.fillText(p.mes, p.x, canvas.height - padding + 25);
    });

  }, [dades]); // Es redibuixa si canvien les dades

  // Estils per recrear el contenidor de la targeta blanca
  const estilsContenidor = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    padding: '24px',
  };

  const estilsCapcalera = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const estilsTitol = {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  };

  return (
    <div style={estilsContenidor}>
      <div style={estilsCapcalera}>
        <h3 style={estilsTitol}>Vendes Mensuals</h3>
      </div>
      <canvas 
        ref={canvasRef} 
        width={900} // Ajusta l'ample per a més espai lateral
        height={400} 
        style={{ display: 'block' }} // Evita marges estranys del canvas
      />
    </div>
  );
};

export default GraficLiniaVendes;