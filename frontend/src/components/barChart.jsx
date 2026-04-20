import React, { useRef, useEffect } from 'react';

const GraficBarres = ({ dades }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Netegem el canvas per si les dades canvien
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const categories = Object.keys(dades);
    const valors = Object.values(dades);
    const maxValor = Math.max(...valors);

    // Configuració
    const padding = 50;
    const ampleBarra = 40;
    const espai = 30;
    const alcadaMaxima = canvas.height - padding * 2;

    // Dibuixem l'eix base
    ctx.beginPath();
    ctx.strokeStyle = "#333";
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    categories.forEach((cat, i) => {
      // Calculem l'alçada proporcional al valor màxim
      const alcadaProporcional = (valors[i] / maxValor) * alcadaMaxima;
      
      const x = padding + i * (ampleBarra + espai) + 20;
      const y = (canvas.height - padding) - alcadaProporcional;

      // Dibuixar la barra
      ctx.fillStyle = "#61dafb"; // Color "React"
      ctx.fillRect(x, y, ampleBarra, alcadaProporcional);

      // Text de la categoria (Eix X)
      ctx.fillStyle = "#000";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(cat, x + ampleBarra / 2, canvas.height - padding + 20);

      // Valor a sobre de la barra
      ctx.fillText(valors[i], x + ampleBarra / 2, y - 10);
    });
  }, [dades]); // Es torna a dibuixar si les dades canvien

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Estadístiques de Productes</h2>
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={300} 
        style={{ border: '1px solid #eee', borderRadius: '8px' }}
      />
    </div>
  );
};

export default GraficBarres;