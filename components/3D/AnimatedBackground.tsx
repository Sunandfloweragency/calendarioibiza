import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  variant?: 'particles' | 'waves' | 'matrix' | 'geometric';
  intensity?: 'low' | 'medium' | 'high';
  color?: 'gold' | 'orange' | 'purple' | 'multi';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  variant = 'particles',
  intensity = 'medium',
  color = 'multi'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Colores según la variante
    const colors = {
      gold: ['#DDA95D', '#F8E3C1', '#B8860B'],
      orange: ['#FF9000', '#FFB344', '#FF6B00'],
      purple: ['#7F00FF', '#A366FF', '#5D00CC'],
      multi: ['#DDA95D', '#FF9000', '#7F00FF', '#F8E3C1']
    };

    const colorPalette = colors[color];

    // Configuración según intensidad
    const config = {
      low: { count: 30, speed: 0.5, size: 2 },
      medium: { count: 60, speed: 1, size: 3 },
      high: { count: 100, speed: 1.5, size: 4 }
    };

    const settings = config[intensity];

    // Partículas
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      opacity: number;
      life: number;
    }> = [];

    // Crear partículas
    for (let i = 0; i < settings.count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * settings.speed,
        vy: (Math.random() - 0.5) * settings.speed,
        size: Math.random() * settings.size + 1,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        opacity: Math.random() * 0.5 + 0.1,
        life: Math.random() * 100 + 50
      });
    }

    // Función de animación
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (variant === 'particles') {
        // Animar partículas
        particles.forEach((particle, index) => {
          // Actualizar posición
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life--;

          // Rebotar en los bordes
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          // Regenerar partícula si muere
          if (particle.life <= 0) {
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() * canvas.height;
            particle.life = Math.random() * 100 + 50;
            particle.opacity = Math.random() * 0.5 + 0.1;
          }

          // Dibujar partícula
          ctx.save();
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          // Efecto de brillo
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          gradient.addColorStop(0, particle.color + '40');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Conectar partículas cercanas
          particles.forEach((otherParticle, otherIndex) => {
            if (index !== otherIndex) {
              const dx = particle.x - otherParticle.x;
              const dy = particle.y - otherParticle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 100) {
                ctx.save();
                ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                ctx.strokeStyle = particle.color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
                ctx.restore();
              }
            }
          });
        });
      } else if (variant === 'waves') {
        // Ondas animadas
        const time = Date.now() * 0.001;
        ctx.strokeStyle = colorPalette[0] + '30';
        ctx.lineWidth = 2;

        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          for (let x = 0; x <= canvas.width; x += 10) {
            const y = canvas.height / 2 + 
              Math.sin((x * 0.01) + (time * settings.speed) + (i * 0.5)) * (50 + i * 20) +
              Math.sin((x * 0.005) + (time * settings.speed * 0.5) + (i * 0.3)) * (30 + i * 10);
            
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }
      } else if (variant === 'geometric') {
        // Formas geométricas flotantes
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < 20; i++) {
          const x = (Math.sin(time * 0.5 + i) * 200) + canvas.width / 2;
          const y = (Math.cos(time * 0.3 + i) * 150) + canvas.height / 2;
          const size = 20 + Math.sin(time + i) * 10;
          const rotation = time + i;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rotation);
          ctx.globalAlpha = 0.1 + Math.sin(time + i) * 0.1;
          ctx.strokeStyle = colorPalette[i % colorPalette.length];
          ctx.lineWidth = 2;
          
          // Dibujar hexágono
          ctx.beginPath();
          for (let j = 0; j < 6; j++) {
            const angle = (j * Math.PI) / 3;
            const px = Math.cos(angle) * size;
            const py = Math.sin(angle) * size;
            if (j === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [variant, intensity, color]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default AnimatedBackground; 