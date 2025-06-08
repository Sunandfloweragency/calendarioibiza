import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass' | 'gold' | 'minimal' | 'light-outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
  title?: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
  title,
  icon,
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center
    font-bold tracking-wider text-center
    border-2 border-transparent
    transition-all duration-300 ease-out
    cursor-pointer overflow-hidden
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-black
    ${fullWidth ? 'w-full' : ''}
  `;

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs rounded-md',
    sm: 'px-4 py-2 text-xs rounded-lg',
    md: 'px-6 py-3 text-sm rounded-lg',
    lg: 'px-8 py-4 text-base rounded-xl',
    xl: 'px-10 py-5 text-lg rounded-xl'
  };

  const variantClasses = {
    primary: `
      btn-modern bg-gradient-orange text-brand-white
      hover:shadow-orange-glow focus:ring-brand-orange/50
      before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
    `,
    secondary: `
      btn-modern bg-gradient-purple text-brand-white
      hover:shadow-purple-glow focus:ring-brand-purple/50
      before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
    `,
    outline: `
      btn-outline border-brand-orange text-brand-orange
      hover:bg-brand-orange hover:text-brand-black
      focus:ring-brand-orange/50
    `,
    ghost: `
      bg-transparent text-brand-white border-transparent
      hover:bg-brand-white/10 hover:text-brand-orange
      focus:ring-brand-white/50
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700 text-brand-white
      hover:from-red-700 hover:to-red-800 hover:shadow-red-glow
      focus:ring-red-500/50
      before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
    `,
    glass: `
      glass bg-brand-surface/30 text-brand-white border-brand-white/20
      hover:bg-brand-white/10 hover:border-brand-orange/50
      focus:ring-brand-orange/50
    `,
    gold: `
      bg-gradient-to-r from-yellow-600 to-yellow-700 text-brand-black
      hover:from-yellow-500 hover:to-yellow-600 hover:shadow-yellow-glow
      focus:ring-yellow-500/50
    `,
    minimal: `
      bg-transparent text-brand-white/70 border-transparent
      hover:text-brand-white hover:bg-brand-white/5
      focus:ring-brand-white/30
    `,
    'light-outline': `
      border-brand-white/30 text-brand-white bg-transparent
      hover:border-brand-orange hover:text-brand-orange
      focus:ring-brand-orange/50
    `
  };

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      title={title}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {/* Shine effect */}
      {(variant === 'primary' || variant === 'secondary' || variant === 'danger') && (
        <span className="absolute inset-0 -top-full h-full w-full transform skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></span>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="mr-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </button>
  );
};

export default Button;