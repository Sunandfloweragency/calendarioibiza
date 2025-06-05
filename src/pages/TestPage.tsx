import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-black text-brand-light p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-brand-orange mb-8 animate-fade-in">
          🌞🌻 Sun & Flower Ibiza Calendar - Prueba de Estilos
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Colores de marca */}
          <div className="bg-brand-surface p-6 rounded-xl shadow-main-card hover:shadow-main-card-hover transition-all duration-300">
            <h2 className="text-xl font-bold text-brand-gold mb-4">Colores de Marca</h2>
            <div className="space-y-2">
              <div className="bg-brand-orange h-8 rounded text-white text-center leading-8">Orange</div>
              <div className="bg-brand-purple h-8 rounded text-white text-center leading-8">Purple</div>
              <div className="bg-brand-gold h-8 rounded text-white text-center leading-8">Gold</div>
            </div>
          </div>

          {/* Card 2: Efectos 3D */}
          <div className="bg-brand-surface p-6 rounded-xl shadow-glass hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-bold text-brand-purple mb-4">Efectos 3D</h2>
            <div className="sun-flower-mega-3d text-2xl text-center mb-4">
              SUN & FLOWER
            </div>
            <p className="text-brand-gray text-sm">Efecto 3D con gradientes animados</p>
          </div>

          {/* Card 3: Animaciones */}
          <div className="bg-brand-surface p-6 rounded-xl shadow-neon-glow animate-float">
            <h2 className="text-xl font-bold text-brand-light mb-4">Animaciones</h2>
            <div className="text-brand-orange animate-pulse-gentle">Pulsando suavemente</div>
            <div className="text-brand-purple animate-bounce-gentle">Rebotando</div>
            <div className="text-brand-gold animate-shimmer bg-gradient-gold bg-clip-text text-transparent">Shimmer Effect</div>
          </div>

          {/* Card 4: Tipografías */}
          <div className="bg-brand-surface p-6 rounded-xl shadow-purple-glow">
            <h2 className="text-xl font-serif text-brand-gold mb-4">Tipografías</h2>
            <p className="font-sans text-brand-light mb-2">Montserrat (Sans)</p>
            <p className="font-serif text-brand-orange mb-2">Playfair Display (Serif)</p>
            <p className="font-display text-brand-purple mb-2">Unbounded (Display)</p>
            <p className="font-mono text-brand-gray text-sm">Space Mono (Mono)</p>
          </div>

          {/* Card 5: Gradientes */}
          <div className="bg-gradient-luxury p-6 rounded-xl shadow-orange-glow">
            <h2 className="text-xl font-bold text-brand-light mb-4">Gradientes</h2>
            <div className="bg-gradient-gold h-12 rounded mb-2"></div>
            <div className="bg-gradient-purple h-12 rounded mb-2"></div>
            <div className="bg-gradient-orange h-12 rounded"></div>
          </div>

          {/* Card 6: Estados interactivos */}
          <div className="bg-brand-surface p-6 rounded-xl shadow-luxury hover:shadow-luxury-hover group cursor-pointer transition-all duration-500">
            <h2 className="text-xl font-bold text-brand-light mb-4 group-hover:text-brand-orange transition-colors">
              Estados Hover
            </h2>
            <p className="text-brand-gray group-hover:text-brand-light transition-colors">
              Pasa el mouse por encima para ver los efectos
            </p>
            <div className="mt-4 bg-brand-gold h-2 w-0 group-hover:w-full transition-all duration-700 rounded"></div>
          </div>
        </div>

        {/* Sección de texto grande */}
        <div className="mt-12 text-center">
          <h3 className="text-mega font-display font-black text-gradient-orange animate-gradientBG">
            IBIZA
          </h3>
          <p className="text-xl text-brand-gray mt-4 animate-slide-up-fade">
            Calendario de eventos de la vida nocturna más exclusiva
          </p>
        </div>

        {/* Botones de prueba */}
        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-brand-orange hover:bg-brand-orange-light text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 shadow-orange-glow">
            Botón Orange
          </button>
          <button className="bg-brand-purple hover:bg-brand-purple-light text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 shadow-purple-glow">
            Botón Purple
          </button>
          <button className="bg-brand-gold hover:bg-brand-gold-light text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 shadow-neon-glow">
            Botón Gold
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 