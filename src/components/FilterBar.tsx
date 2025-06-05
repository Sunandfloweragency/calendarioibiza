import React, { useState, useEffect } from 'react';
import { FilterOptions } from '../types';
import { useData } from '../contexts/DataContext';
import { EVENT_TYPES } from '../constants';
import Button from './common/Button';
import { 
  AdjustmentsHorizontalIcon, 
  CalendarDaysIcon, 
  MusicalNoteIcon, 
  UserGroupIcon, 
  BuildingStorefrontIcon, 
  TagIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [activeFilters, setActiveFilters] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { djs, promoters, clubs } = useData();

  // Calcular el número de filtros activos
  useEffect(() => {
    const filterCount = Object.values(filters).filter(value => value && value !== '').length;
    setActiveFilters(filterCount);
  }, [filters]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  // Estilo común para los selects
  const selectClassName = `
    w-full px-4 py-3 bg-brand-surface border border-brand-gold/10 rounded-lg
    text-brand-light placeholder-brand-gray/60 focus:border-brand-gold
    transition-all duration-300 focus:ring-0 focus:shadow-neon-glow
    appearance-none bg-no-repeat bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23DDA95D' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")]
    bg-[length:20px_20px] bg-[center_right_0.5rem]
  `;

  // Estilo para el datepicker
  const datePickerClassName = `
    w-full px-4 py-3 bg-brand-surface border border-brand-gold/10 rounded-lg
    text-brand-light placeholder-brand-gray/60 focus:border-brand-gold
    transition-all duration-300 focus:ring-0 focus:shadow-neon-glow
  `;

  // Formato para la fecha
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = formatDate(new Date());

  return (
    <div className="relative">
      {/* Botón de filtros móvil */}
      <div className="md:hidden mb-4">
        <Button 
          onClick={() => setIsOpen(!isOpen)} 
          variant="glass" 
          size="md" 
          fullWidth 
          icon={<AdjustmentsHorizontalIcon className="w-5 h-5" />}
          className="justify-between"
        >
          <span>Filtros</span>
          {activeFilters > 0 && (
            <span className="bg-brand-gold text-brand-black text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFilters}
            </span>
          )}
        </Button>
      </div>
      
      {/* Formulario de filtros - visible en desktop, expandible en móvil */}
      <div className={`
        transition-all duration-500 ease-luxury overflow-hidden bg-gradient-luxury
        rounded-xl shadow-luxury border border-brand-gold/10 backdrop-blur-md
        ${isOpen || activeFilters > 0 ? 'max-h-[800px] opacity-100' : 'md:max-h-[800px] md:opacity-100 max-h-0 opacity-0'}
      `}>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cabecera */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-brand-gold mr-2" />
              <h3 className="text-xl font-serif font-bold text-brand-gold">Filtrar Eventos</h3>
            </div>
            {isOpen && (
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="p-1 text-brand-light/60 hover:text-brand-light transition-colors duration-300 md:hidden"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Separador decorativo */}
          <div className="luxury-divider"></div>
          
          {/* Campos de filtro */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Fecha */}
            <div className="space-y-2">
              <label htmlFor="date" className="flex items-center text-sm font-medium text-brand-light">
                <CalendarDaysIcon className="w-4 h-4 text-brand-gold mr-1.5" />
                Fecha
              </label>
              <input
                type="date"
                name="date"
                id="date"
                min={today}
                value={filters.date || ''}
                onChange={handleChange}
                className={datePickerClassName}
              />
            </div>
            
            {/* Tipo de evento */}
            <div className="space-y-2">
              <label htmlFor="eventType" className="flex items-center text-sm font-medium text-brand-light">
                <TagIcon className="w-4 h-4 text-brand-gold mr-1.5" />
                Tipo de Evento
              </label>
              <select 
                name="eventType" 
                id="eventType"
                value={filters.eventType || ''} 
                onChange={handleChange}
                className={selectClassName}
              >
                <option value="">Todos los tipos</option>
                {EVENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* DJ */}
            <div className="space-y-2">
              <label htmlFor="djId" className="flex items-center text-sm font-medium text-brand-light">
                <MusicalNoteIcon className="w-4 h-4 text-brand-gold mr-1.5" />
                DJ
              </label>
              <select 
                name="djId" 
                id="djId"
                value={filters.djId || ''} 
                onChange={handleChange}
                className={selectClassName}
              >
                <option value="">Todos los DJs</option>
                {djs.map(dj => (
                  <option key={dj.id} value={dj.id}>{dj.name}</option>
                ))}
              </select>
            </div>
            
            {/* Promotor */}
            <div className="space-y-2">
              <label htmlFor="promoterId" className="flex items-center text-sm font-medium text-brand-light">
                <UserGroupIcon className="w-4 h-4 text-brand-gold mr-1.5" />
                Promotor
              </label>
              <select 
                name="promoterId" 
                id="promoterId"
                value={filters.promoterId || ''} 
                onChange={handleChange}
                className={selectClassName}
              >
                <option value="">Todos los promotores</option>
                {promoters.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            
            {/* Club */}
            <div className="space-y-2">
              <label htmlFor="clubId" className="flex items-center text-sm font-medium text-brand-light">
                <BuildingStorefrontIcon className="w-4 h-4 text-brand-gold mr-1.5" />
                Club
              </label>
              <select 
                name="clubId" 
                id="clubId"
                value={filters.clubId || ''} 
                onChange={handleChange}
                className={selectClassName}
              >
                <option value="">Todos los clubs</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Separador decorativo */}
          <div className="luxury-divider"></div>
          
          {/* Botones */}
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <Button 
              type="button" 
              onClick={handleReset} 
              variant="outline" 
              size="md" 
              className="w-full sm:w-auto"
            >
              Limpiar Filtros
            </Button>
            <Button 
              type="submit" 
              variant="gold" 
              size="md" 
              className="w-full sm:w-auto"
              icon={<AdjustmentsHorizontalIcon className="w-4 h-4" />}
            >
              Aplicar Filtros
              {activeFilters > 0 && (
                <span className="ml-2 bg-white text-brand-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFilters}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
      
      {/* Resumen de filtros activos */}
      {activeFilters > 0 && (
        <div className="mt-4 bg-brand-surface-variant/50 backdrop-blur-sm rounded-lg p-3 border border-brand-gold/5 flex items-center justify-between">
          <div className="flex items-center text-sm text-brand-light">
            <span className="text-brand-gold font-medium mr-2">Filtros activos:</span>
            <span className="bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full font-mono">
              {activeFilters}
            </span>
          </div>
          <Button 
            variant="minimal" 
            size="xs" 
            onClick={handleReset}
            icon={<XMarkIcon className="w-4 h-4" />}
          >
            Limpiar
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;