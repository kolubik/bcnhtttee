import React, { useEffect, useRef } from 'react';

export const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*';
    const fontSize = 14;
    
    const initCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      const columns = Math.floor(canvas.width / (fontSize * dpr));
      const drops: number[] = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
      }
      ctx.scale(dpr, dpr);
      return { columns, drops };
    };

    let { drops } = initCanvas();

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)'; // Increased alpha for cleaner trail
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#06b6d4'; // Cyan 500 to match the theme
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      const res = initCanvas();
      drops = res.drops;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-[0.05] z-0"
    />
  );
};
