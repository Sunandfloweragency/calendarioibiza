import React, { useState, useRef, useEffect } from 'react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  glowIntensity?: number;
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  glowIntensity = 1
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const variants = {
    primary: {
      bg: 'from-brand-gold via-brand-orange to-brand-gold',
      shadow: 'rgba(221, 169, 93, 0.5)',
      border: 'border-brand-gold'
    },
    secondary: {
      bg: 'from-brand-purple via-purple-500 to-brand-purple',
      shadow: 'rgba(127, 0, 255, 0.5)',
      border: 'border-brand-purple'
    },
    accent: {
      bg: 'from-brand-orange via-red-500 to-brand-orange',
      shadow: 'rgba(255, 144, 0, 0.5)',
      border: 'border-brand-orange'
    }
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const newRipple = { id: Date.now(), x, y };
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }

    onClick?.();
  };

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsPressed(false);

    button.addEventListener('mousedown', handleMouseDown);
    button.addEventListener('mouseup', handleMouseUp);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousedown', handleMouseDown);
      button.removeEventListener('mouseup', handleMouseUp);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-xl font-bold
        bg-gradient-to-r ${currentVariant.bg}
        border-2 ${currentVariant.border}
        ${currentSize}
        transform transition-all duration-200 ease-out
        hover:scale-105 active:scale-95
        ${isPressed ? 'translate-y-1' : 'translate-y-0'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-4 focus:ring-opacity-50
        ${className}
      `}
      style={{
        boxShadow: disabled
          ? 'none'
          : `
            0 0 ${20 * glowIntensity}px ${currentVariant.shadow},
            0 0 ${40 * glowIntensity}px ${currentVariant.shadow},
            0 ${isPressed ? 2 : 8}px ${isPressed ? 4 : 16}px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
        textShadow: `0 0 10px rgba(255, 255, 255, 0.8)`,
        filter: `brightness(${isPressed ? 0.9 : 1})`
      }}
    >
      {/* Efecto de brillo animado */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-300"
        style={{
          transform: 'translateX(-100%)',
          animation: 'shine 2s ease-in-out infinite'
        }}
      />

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full bg-white opacity-30 pointer-events-none"
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
            width: '0px',
            height: '0px',
            transform: 'translate(-50%, -50%)',
            animation: 'ripple 0.6s ease-out'
          }}
        />
      ))}

      {/* Contenido del botón */}
      <span className="relative z-10 text-white drop-shadow-lg">
        {children}
      </span>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-0 hover:opacity-60"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + Math.sin(i) * 60}%`,
              animation: `float 3s ease-in-out infinite ${i * 0.5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes ripple {
          to {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) opacity: 0; }
          50% { transform: translateY(-10px) opacity: 1; }
        }
      `}</style>
    </button>
  );
};

export default NeonButton; 