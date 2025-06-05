import React, { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  StopIcon, 
  CogIcon, 
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface ScrapingStats {
  totalEvents: number;
  newEvents: number;
  duplicateEvents: number;
  newProfiles: number;
  errors: number;
  lastRun: string;
  averageDuration: number;
  isRunning: boolean;
}

interface ScrapingSource {
  name: string;
  enabled: boolean;
  lastRun?: string;
  status: 'idle' | 'running' | 'error' | 'success';
  eventsFound: number;
  errors: string[];
}

const ScrapingDashboard: React.FC = () => {
  const [stats, setStats] = useState<ScrapingStats>({
    totalEvents: 0,
    newEvents: 0,
    duplicateEvents: 0,
    newProfiles: 0,
    errors: 0,
    lastRun: '',
    averageDuration: 0,
    isRunning: false
  });

  const [sources, setSources] = useState<ScrapingSource[]>([
    { name: 'Resident Advisor', enabled: true, status: 'idle', eventsFound: 0, errors: [] },
    { name: 'Four Venues', enabled: true, status: 'idle', eventsFound: 0, errors: [] },
    { name: 'Ibiza Spotlight', enabled: true, status: 'idle', eventsFound: 0, errors: [] },
    { name: 'Essential Ibiza', enabled: true, status: 'idle', eventsFound: 0, errors: [] },
    { name: "What's On Ibiza", enabled: true, status: 'idle', eventsFound: 0, errors: [] },
    { name: 'Dice', enabled: false, status: 'idle', eventsFound: 0, errors: [] },
  ]);

  const [logs, setLogs] = useState<string[]>([]);
  const [isManualRunning, setIsManualRunning] = useState(false);

  // Simular datos en tiempo real (en producción vendría de la API)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular actualización de stats
      setStats(prev => ({
        ...prev,
        totalEvents: Math.floor(Math.random() * 1000) + 500,
        newEvents: Math.floor(Math.random() * 50) + 10,
        duplicateEvents: Math.floor(Math.random() * 20) + 5,
        newProfiles: Math.floor(Math.random() * 30) + 5,
        errors: Math.floor(Math.random() * 5),
        lastRun: new Date().toISOString(),
        averageDuration: Math.floor(Math.random() * 300000) + 180000, // 3-8 minutos
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRunScraping = async () => {
    setIsManualRunning(true);
    addLog('🚀 Iniciando scraping manual...');
    
    // Simular ejecución de scraping
    for (const source of sources) {
      if (source.enabled) {
        setSources(prev => prev.map(s => 
          s.name === source.name ? { ...s, status: 'running' } : s
        ));
        
        addLog(`🔍 Scrapeando ${source.name}...`);
        
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const eventsFound = Math.floor(Math.random() * 50) + 5;
        setSources(prev => prev.map(s => 
          s.name === source.name ? { 
            ...s, 
            status: 'success', 
            eventsFound,
            lastRun: new Date().toISOString()
          } : s
        ));
        
        addLog(`✅ ${source.name}: ${eventsFound} eventos encontrados`);
      }
    }
    
    addLog('🎉 Scraping completado exitosamente');
    setIsManualRunning(false);
  };

  const handleStopScraping = () => {
    setIsManualRunning(false);
    setSources(prev => prev.map(s => ({ ...s, status: 'idle' })));
    addLog('⏹️ Scraping detenido manualmente');
  };

  const toggleSource = (sourceName: string) => {
    setSources(prev => prev.map(s => 
      s.name === sourceName ? { ...s, enabled: !s.enabled } : s
    ));
    addLog(`🔧 ${sourceName} ${sources.find(s => s.name === sourceName)?.enabled ? 'deshabilitado' : 'habilitado'}`);
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>;
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="min-h-screen bg-brand-black py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-mega text-gradient mb-6">
            SCRAPING
            <br />
            <span className="text-gradient-reverse">DASHBOARD</span>
          </h1>
          <p className="text-xl text-brand-gray max-w-3xl mx-auto">
            Panel de control para el sistema de scraping de eventos de Ibiza
          </p>
        </div>

        {/* Controles principales */}
        <div className="glass rounded-2xl p-8 mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${stats.isRunning || isManualRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-brand-white font-medium">
                Estado: {stats.isRunning || isManualRunning ? 'Ejecutándose' : 'Inactivo'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isManualRunning ? (
                <button
                  onClick={handleRunScraping}
                  className="btn-modern px-6 py-3 rounded-lg flex items-center space-x-2"
                  disabled={stats.isRunning}
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>Ejecutar Scraping</span>
                </button>
              ) : (
                <button
                  onClick={handleStopScraping}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-300"
                >
                  <StopIcon className="w-5 h-5" />
                  <span>Detener</span>
                </button>
              )}
              
              <button className="btn-outline px-6 py-3 rounded-lg flex items-center space-x-2">
                <CogIcon className="w-5 h-5" />
                <span>Configuración</span>
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-orange rounded-xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <ChartBarIcon className="w-8 h-8 text-brand-orange" />
              <span className="text-2xl font-bold text-brand-white">{stats.totalEvents}</span>
            </div>
            <h3 className="text-brand-white font-semibold mb-2">Total Eventos</h3>
            <p className="text-brand-gray text-sm">Eventos en la base de datos</p>
          </div>

          <div className="glass-purple rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <InformationCircleIcon className="w-8 h-8 text-brand-purple" />
              <span className="text-2xl font-bold text-brand-white">{stats.newEvents}</span>
            </div>
            <h3 className="text-brand-white font-semibold mb-2">Nuevos Eventos</h3>
            <p className="text-brand-gray text-sm">Última ejecución</p>
          </div>

          <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-brand-white">{stats.newProfiles}</span>
            </div>
            <h3 className="text-brand-white font-semibold mb-2">Perfiles Generados</h3>
            <p className="text-brand-gray text-sm">Con IA automática</p>
          </div>

          <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <ClockIcon className="w-8 h-8 text-brand-orange" />
              <span className="text-lg font-bold text-brand-white">{formatDuration(stats.averageDuration)}</span>
            </div>
            <h3 className="text-brand-white font-semibold mb-2">Duración Promedio</h3>
            <p className="text-brand-gray text-sm">Por ejecución completa</p>
          </div>
        </div>

        {/* Fuentes de datos */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="glass rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-display text-gradient mb-6">Fuentes de Datos</h2>
            
            <div className="space-y-4">
              {sources.map((source, index) => (
                <div 
                  key={source.name}
                  className="flex items-center justify-between p-4 bg-brand-surface rounded-lg hover:bg-brand-surface-variant transition-colors duration-300"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(source.status)}
                    <div>
                      <h3 className="text-brand-white font-medium">{source.name}</h3>
                      <p className="text-brand-gray text-sm">
                        {source.lastRun ? `Última ejecución: ${new Date(source.lastRun).toLocaleString()}` : 'No ejecutado'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {source.eventsFound > 0 && (
                      <span className="text-brand-orange font-medium">
                        {source.eventsFound} eventos
                      </span>
                    )}
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={source.enabled}
                        onChange={() => toggleSource(source.name)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logs en tiempo real */}
          <div className="glass rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-display text-gradient mb-6">Logs en Tiempo Real</h2>
            
            <div className="bg-brand-surface rounded-lg p-4 h-80 overflow-y-auto custom-scrollbar">
              {logs.length > 0 ? (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div 
                      key={index}
                      className="text-sm text-brand-gray font-mono leading-relaxed"
                    >
                      {log}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-brand-gray">
                  <p>No hay logs disponibles</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="glass rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-display text-gradient mb-6">Configuración del Sistema</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-brand-surface rounded-lg p-6">
              <h3 className="text-brand-white font-semibold mb-4">Horarios Programados</h3>
              <div className="space-y-2 text-sm text-brand-gray">
                <div>• Scraping diario: 6:00 AM</div>
                <div>• Scraping semanal: Domingos 2:00 AM</div>
                <div>• Generación de perfiles: 4:00 AM</div>
              </div>
            </div>

            <div className="bg-brand-surface rounded-lg p-6">
              <h3 className="text-brand-white font-semibold mb-4">Límites de Rate</h3>
              <div className="space-y-2 text-sm text-brand-gray">
                <div>• Delay entre requests: 2000ms</div>
                <div>• Máximo eventos por fuente: 1000</div>
                <div>• Timeout por request: 30s</div>
              </div>
            </div>

            <div className="bg-brand-surface rounded-lg p-6">
              <h3 className="text-brand-white font-semibold mb-4">IA y Perfiles</h3>
              <div className="space-y-2 text-sm text-brand-gray">
                <div>• Modelo: GPT-4</div>
                <div>• Confianza mínima: 50%</div>
                <div>• Procesamiento en lotes: 5</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapingDashboard; 