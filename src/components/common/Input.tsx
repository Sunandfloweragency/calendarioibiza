import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, name, error, className, ...props }) => {
  return (
    <div className="mb-4 w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-brand-gray mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={`w-full px-3 py-2 bg-brand-surface-variant border border-brand-surface rounded-md text-black focus:ring-brand-orange focus:border-brand-orange transition-colors ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Input;