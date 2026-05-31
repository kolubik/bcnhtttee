import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

interface CyberParticlesProps {
  text: string;
  className?: string;
}

export const CyberParticles: React.FC<CyberParticlesProps> = ({ text, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    let animationFrameId: number;
    let mouse = { x: -1000, y: -1000 };

    const init = () => {
      const width = containerRef.current?.clientWidth || 0;
      const height = containerRef.current?.clientHeight || 0;

      if (width <= 0 || height <= 0) return;

      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = 'white';
      ctx.font = 'bold 4rem Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      particles = [];

      // Sampling text pixels
      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          const index = (y * canvas.width + x) * 4;
          if (imageData.data[index + 3] > 128) {
            particles.push({
              x,
              y,
              baseX: x,
              baseY: y,
              color: 'rgba(34, 211, 238, 0.8)', // cyan-400
              size: Math.random() * 2 + 1,
              vx: 0,
              vy: 0,
              density: Math.random() * 30 + 1,
            });
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = 100;
        const force = (maxDistance - distance) / maxDistance;

        if (distance < maxDistance) {
          p.vx -= forceDirectionX * force * p.density;
          p.vy -= forceDirectionY * force * p.density;
        } else {
          p.vx += (p.baseX - p.x) * 0.1;
          p.vy += (p.baseY - p.y) * 0.1;
        }

        p.vx *= 0.85;
        p.vy *= 0.85;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    init();
    animate();

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [text]);

  return (
    <div ref={containerRef} className={cn("relative w-full h-32 flex items-center justify-center", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 cursor-default" />
    </div>
  );
};

