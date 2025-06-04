import React, { useRef, useEffect, useState } from 'react';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: string;
}

const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  className = '',
  intensity = 1,
  glowColor = '#DDA95D'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePosition({ x: 50, y: 50 });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const transformStyle = isHovered
    ? `perspective(1000px) rotateX(${(mousePosition.y - 50) * 0.1 * intensity}deg) rotateY(${(mousePosition.x - 50) * 0.1 * intensity}deg) translateZ(20px)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';

  const gradientStyle = {
    background: `
      radial-gradient(
        circle at ${mousePosition.x}% ${mousePosition.y}%,
        rgba(221, 169, 93, ${isHovered ? 0.3 : 0.1}) 0%,
        rgba(255, 144, 0, ${isHovered ? 0.2 : 0.05}) 25%,
        rgba(127, 0, 255, ${isHovered ? 0.2 : 0.05}) 50%,
        transparent 70%
      ),
      linear-gradient(
        135deg,
        rgba(221, 169, 93, 0.1) 0%,
        rgba(255, 144, 0, 0.05) 50%,
        rgba(127, 0, 255, 0.1) 100%
      )
    `,
    boxShadow: isHovered
      ? `
        0 0 40px rgba(221, 169, 93, 0.4),
        0 0 80px rgba(255, 144, 0, 0.2),
        inset 0 0 40px rgba(221, 169, 93, 0.1)
      `
      : `
        0 0 20px rgba(221, 169, 93, 0.2),
        0 0 40px rgba(255, 144, 0, 0.1)
      `
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative overflow-hidden rounded-2xl backdrop-blur-md
        border border-opacity-30 border-brand-gold
        transition-all duration-300 ease-out
        transform-gpu cursor-pointer
        ${className}
      `}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        ...gradientStyle
      }}
    >
      {/* Efecto de brillo holográfico */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 3.6}deg,
              transparent 30%,
              rgba(221, 169, 93, 0.3) 50%,
              transparent 70%
            )
          `
        }}
      />
      
      {/* Contenido */}
      <div className="relative z-10 p-6">
        {children}
      </div>
      
      {/* Efecto de partículas en los bordes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-brand-gold rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              left: `${(i * 12.5) + Math.sin(Date.now() * 0.001 + i) * 5}%`,
              top: `${Math.cos(Date.now() * 0.001 + i) * 5 + 50}%`,
              animation: `sparkle 2s ease-in-out infinite ${i * 0.25}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default HolographicCard; 