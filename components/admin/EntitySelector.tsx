import React, { useState, useMemo } from 'react';
import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Option {
  id: string;
  name: string;
  slug: string;
  image?: string;
  subtitle?: string;
}

interface EntitySelectorProps {
  label: string;
  options: Option[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  maxSelections?: number;
  showImages?: boolean;
  allowEmpty?: boolean;
}

const EntitySelector: React.FC<EntitySelectorProps> = ({
  label,
  options = [],
  selectedIds = [],
  onSelectionChange,
  multiple = false,
  placeholder = "Seleccionar...",
  maxSelections,
  showImages = true,
  allowEmpty = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    
    const term = searchTerm.toLowerCase();
    return options.filter(option => 
      option.name.toLowerCase().includes(term) ||
      (option.subtitle && option.subtitle.toLowerCase().includes(term))
    );
  }, [options, searchTerm]);

  const selectedOptions = useMemo(() => 
    options.filter(option => selectedIds.includes(option.id)),
    [options, selectedIds]
  );

  const canAddMore = !maxSelections || selectedIds.length < maxSelections;

  const handleToggleOption = (optionId: string) => {
    let newSelectedIds: string[];
    
    if (multiple) {
      if (selectedIds.includes(optionId)) {
        newSelectedIds = selectedIds.filter(id => id !== optionId);
      } else if (canAddMore) {
        newSelectedIds = [...selectedIds, optionId];
      } else {
        return; // No se puede añadir más
      }
    } else {
      newSelectedIds = selectedIds.includes(optionId) ? (allowEmpty ? [] : [optionId]) : [optionId];
      setIsOpen(false);
    }
    
    onSelectionChange(newSelectedIds);
  };

  const handleRemoveOption = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelectedIds = selectedIds.filter(id => id !== optionId);
    onSelectionChange(newSelectedIds);
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }
    
    if (!multiple) {
      return selectedOptions[0]?.name || placeholder;
    }
    
    if (selectedOptions.length === 1) {
      return selectedOptions[0].name;
    }
    
    return `${selectedOptions.length} seleccionado${selectedOptions.length > 1 ? 's' : ''}`;
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-brand-white mb-2">
        {label}
        {maxSelections && (
          <span className="text-brand-gray text-xs ml-2">
            (máx. {maxSelections})
          </span>
        )}
      </label>
      
      {/* Selected items display para multiple selection */}
      {multiple && selectedOptions.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedOptions.map(option => (
            <div
              key={option.id}
              className="flex items-center bg-brand-orange/20 border border-brand-orange/30 rounded-lg px-3 py-1 text-sm"
            >
              {showImages && option.image && (
                <img
                  src={option.image}
                  alt={option.name}
                  className="w-6 h-6 rounded-full object-cover mr-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <span className="text-brand-white">{option.name}</span>
              <button
                type="button"
                onClick={(e) => handleRemoveOption(option.id, e)}
                className="ml-2 text-brand-gray hover:text-white transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Selector dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 bg-brand-dark border border-brand-gray/30 rounded-md text-left text-white focus:border-brand-orange focus:outline-none flex items-center justify-between"
        >
          <span className={selectedOptions.length === 0 ? 'text-brand-gray/50' : 'text-white'}>
            {getDisplayText()}
          </span>
          <ChevronDownIcon 
            className={`w-5 h-5 text-brand-gray transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-brand-dark border border-brand-gray/30 rounded-md shadow-lg max-h-64 overflow-hidden">
            {/* Search input */}
            <div className="p-3 border-b border-brand-gray/20">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-gray" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-3 py-2 bg-brand-black border border-brand-gray/30 rounded text-white text-sm placeholder-brand-gray/50 focus:border-brand-orange focus:outline-none"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-center text-brand-gray">
                  {searchTerm ? 'No se encontraron resultados' : 'No hay opciones disponibles'}
                </div>
              ) : (
                filteredOptions.map(option => {
                  const isSelected = selectedIds.includes(option.id);
                  const isDisabled = !isSelected && !canAddMore;
                  
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => !isDisabled && handleToggleOption(option.id)}
                      disabled={isDisabled}
                      className={`w-full px-3 py-3 text-left hover:bg-brand-gray/10 transition-colors flex items-center ${
                        isSelected 
                          ? 'bg-brand-orange/20 text-brand-orange' 
                          : isDisabled 
                            ? 'text-brand-gray/50 cursor-not-allowed'
                            : 'text-white'
                      }`}
                    >
                      {showImages && option.image && (
                        <img
                          src={option.image}
                          alt={option.name}
                          className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/40x40?text=${option.name.charAt(0)}`;
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{option.name}</div>
                        {option.subtitle && (
                          <div className="text-sm text-brand-gray/70 truncate">{option.subtitle}</div>
                        )}
                      </div>
                      {isSelected && (
                        <div className="flex-shrink-0 ml-2">
                          <div className="w-5 h-5 bg-brand-orange rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info text */}
      {multiple && maxSelections && (
        <p className="text-xs text-brand-gray mt-1">
          {selectedIds.length} de {maxSelections} seleccionado{maxSelections > 1 ? 's' : ''}
        </p>
      )}
      
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default EntitySelector; 