import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  variant?: 'default' | 'minimal' | 'professional';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Cargando...',
  variant = 'professional'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center">
        <div className={`${sizeClasses[size]} border-2 border-brand-orange border-t-transparent rounded-full animate-spin`}></div>
      </div>
    );
  }

  if (variant === 'professional') {
    return (
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Spinner principal con efectos 3D */}
        <div className="relative">
          {/* Anillo exterior */}
          <div className={`${sizeClasses[size]} border-4 border-brand-surface rounded-full`}></div>
          
          {/* Anillo giratorio dorado */}
          <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-brand-gold rounded-full animate-spin`}></div>
          
          {/* Anillo giratorio naranja (velocidad diferente) */}
          <div className={`absolute inset-1 ${sizeClasses[size === 'xl' ? 'lg' : size === 'lg' ? 'md' : size === 'md' ? 'sm' : 'sm']} border-3 border-transparent border-t-brand-orange rounded-full animate-spin`} 
               style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
          
          {/* Punto central pulsante */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
          </div>
          
          {/* Efecto de brillo */}
          <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent animate-spin`}
               style={{ animationDuration: '2s' }}></div>
        </div>

        {/* Texto con efecto shimmer */}
        {text && (
          <div className="text-center">
            <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-orange to-brand-gold bg-size-200 animate-shimmer">
              {text}
            </div>
            <div className="text-sm text-brand-gray mt-2 animate-pulse">
              Preparando la experiencia...
            </div>
          </div>
        )}

        {/* Partículas flotantes */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-brand-gold rounded-full opacity-0 animate-ping"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + Math.sin(i) * 40}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Variant default
  return (
    <div className="flex items-center justify-center space-x-3">
      <div className={`${sizeClasses[size]} border-2 border-brand-orange border-t-transparent rounded-full animate-spin`}></div>
      {text && <span className="text-brand-white">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;