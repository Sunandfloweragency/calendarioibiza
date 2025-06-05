import React, { useRef, useEffect } from 'react';

interface FloatingElementsProps {
  count?: number;
  speed?: number;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({ 
  count = 20, 
  speed = 1 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Verificar si el navegador soporta las animaciones necesarias
    if (!CSS.supports('animation', 'float3D 1s ease-in-out infinite')) {
      console.warn('FloatingElements: Animaciones no soportadas en este navegador');
      return;
    }

    try {

    // Crear elementos flotantes
    for (let i = 0; i < count; i++) {
      const element = document.createElement('div');
      element.className = 'floating-element';
      
      // Estilos dinámicos
      const size = Math.random() * 60 + 20;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = (Math.random() * 20 + 10) / speed;
      const delay = Math.random() * 10;
      
      element.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        background: linear-gradient(45deg, 
          rgba(221, 169, 93, 0.05), 
          rgba(255, 144, 0, 0.05), 
          rgba(127, 0, 255, 0.05)
        );
        border-radius: 50%;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(221, 169, 93, 0.1);
        animation: float3D ${duration}s ease-in-out infinite ${delay}s;
        box-shadow: 
          0 0 10px rgba(221, 169, 93, 0.1),
          inset 0 0 10px rgba(255, 144, 0, 0.05);
        pointer-events: none;
        will-change: transform;
      `;
      
      container.appendChild(element);
    }
    } catch (error) {
      console.error('FloatingElements: Error creating floating elements:', error);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [count, speed]);

  return (
    <>
      <div 
        ref={containerRef} 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      />
      <style>{`
        @keyframes float3D {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-15px) translateX(10px) scale(1.1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-30px) translateX(-5px) scale(0.9);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-15px) translateX(-10px) scale(1.05);
            opacity: 0.7;
          }
        }
        
        .floating-element {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default FloatingElements; 