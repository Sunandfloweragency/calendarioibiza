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
            rgba(221, 169, 93, 0.1), 
            rgba(255, 144, 0, 0.1), 
            rgba(127, 0, 255, 0.1)
          );
          border-radius: 50%;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(221, 169, 93, 0.2);
          animation: float3D ${duration}s ease-in-out infinite ${delay}s;
          transform-style: preserve-3d;
          box-shadow: 
            0 0 20px rgba(221, 169, 93, 0.3),
            inset 0 0 20px rgba(255, 144, 0, 0.1);
          pointer-events: none;
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
            transform: translateY(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          25% {
            transform: translateY(-20px) rotateX(90deg) rotateY(45deg) rotateZ(15deg);
          }
          50% {
            transform: translateY(-40px) rotateX(180deg) rotateY(90deg) rotateZ(30deg);
          }
          75% {
            transform: translateY(-20px) rotateX(270deg) rotateY(135deg) rotateZ(45deg);
          }
        }
        
        .floating-element:hover {
          transform: scale(1.2) !important;
          transition: transform 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default FloatingElements; 