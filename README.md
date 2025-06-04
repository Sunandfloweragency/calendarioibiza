# 🌅 Ibiza Calendar - Sun and Flower

Calendario de eventos de música electrónica para Ibiza. Aplicación React optimizada para funcionar en subdominio 
**calendaribiza.sunandfloweragency.com**
## 🚀 **Características**

- **🎵 Eventos de música electrónica** - Calendario completo de Ibiza
- **📱 Responsive Design** - Mobile first con adaptación automática
- **🎨 Interfaz moderna** - Efectos 3D, holográficos y animaciones
- **⚡ Alta performance** - Carga rápida y navegación fluida
- **💾 Persistencia local** - localStorage + Supabase como backup
- **🔍 Búsqueda avanzada** - Filtros por DJ, club, promoter, fecha
- **🌐 Multi-idioma** - Soporte i18next

---

## 🛠 **Stack Tecnológico**

- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Routing**: React Router 6
- **Bundler**: Vite 6
- **Base de datos**: Supabase (PostgreSQL)
- **Persistencia**: localStorage como principal, Supabase como backup
- **Iconos**: Heroicons
- **Idiomas**: i18next

---

## 🏗 **Instalación y Desarrollo**

### Prerrequisitos
```bash
Node.js 18+ 
npm o yarn
```

### Instalación
```bash
# Clonar repositorio
git clone <repo-url>
cd ibiza-calendar

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

### Scripts disponibles
```bash
npm run dev              # Desarrollo (puerto 5173)
npm run build            # Build estándar
npm run build:prod       # Build optimizado para producción
npm run build:subdomain  # Build para subdominio /calendar
npm run preview          # Preview del build
npm run type-check       # Verificar tipos TypeScript
npm run clean            # Limpiar cache y dist
```

---

## 🌐 **Despliegue en Subdominio**

### Para calendaribiza.sunandfloweragency.com

1. **Build para subdominio**:
```bash
npm run build:subdomain
```

2. **Configurar servidor web** (nginx/apache):
```nginx
server {
    listen 80;
    server_name calendaribiza.sunandfloweragency.com;
    
    root /path/to/dist;
    index index.html;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. **Variables de entorno**:
```bash
NODE_ENV=production
VITE_BASE_PATH=/
```

---

## 📁 **Estructura del Proyecto**

```
ibiza-calendar/
├── 📁 components/          # Componentes React
│   ├── 📁 3D/             # Efectos y componentes 3D
│   ├── 📁 admin/          # Panel de administración
│   └── 📁 common/         # Componentes reutilizables
├── 📁 contexts/           # React Context (estado global)
├── 📁 hooks/              # Custom hooks
├── 📁 pages/              # Páginas principales
├── 📁 services/           # Servicios API y lógica
├── 📁 types/              # Tipos TypeScript
├── 📁 utils/              # Utilidades
├── 📄 App.tsx             # Componente principal
├── 📄 main.tsx            # Entry point
└── 📄 styles.css          # Estilos globales
```

---

## 🎯 **Funcionalidades Principales**

### 🏠 **Homepage**
- Hero section con animaciones
- Vista automática: móvil = lista, desktop = calendario
- Eventos próximos con información completa

### 📅 **Calendario**
- Vista mensual interactiva
- Tooltips con información de eventos
- Navegación fluida entre meses
- Responsive design automático

### 🎭 **Perfiles**
- **DJs**: Biografía, géneros, eventos
- **Clubs**: Ubicación, capacidad, eventos
- **Promoters**: Historia, eventos organizados

### 🔍 **Sistema de Búsqueda**
- Filtros por fecha, tipo, DJ, club
- Búsqueda en tiempo real
- Resultados optimizados

---

## 💾 **Sistema de Datos**

### **Estrategia Híbrida**
1. **localStorage** como fuente principal
2. **Supabase** como backup y sincronización
3. **Migración automática** localStorage → Supabase

### **Persistencia Garantizada**
- Datos se mantienen al recargar página
- Sin pérdida de información en navegación
- Estado global estable con React Context

---

## 🚀 **Optimizaciones de Rendimiento**

### **Bundle Splitting**
```js
vendor: ['react', 'react-dom']
router: ['react-router-dom']  
icons: ['@heroicons/react']
```

### **Lazy Loading**
- Componentes de página con Suspense
- Imágenes con loading placeholder
- Código splitting automático

### **Caching**
- Static assets con cache headers
- API responses con localStorage
- React memoization (useMemo, useCallback)

---

## 🔧 **Configuración para Producción**

### **Environment Variables**
```env
NODE_ENV=production
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-key>
```

### **Build Optimizations**
- Minificación con Terser
- Tree shaking automático
- CSS purging con TailwindCSS
- Source maps deshabilitados en producción

---

## 📱 **Responsive Breakpoints**

```css
sm: 640px   # Móvil grande
md: 768px   # Tablet
lg: 1024px  # Desktop pequeño  
xl: 1280px  # Desktop
2xl: 1536px # Desktop grande
```

### **Comportamiento Automático**
- `< 768px`: Vista lista forzada
- `≥ 768px`: Vista calendario por defecto
- Adaptación automática en resize

---

## 🎨 **Design System**

### **Colores Principales**
```css
brand-black: #0a0a0a    # Fondo principal
brand-white: #ffffff    # Texto principal  
brand-orange: #ff9000   # Acento primary
brand-purple: #7f00ff   # Acento secondary
brand-gold: #dda95d     # Acento tertiary
```

### **Efectos Visuales**
- Glass morphism
- Holographic borders
- Floating particles
- Smooth transitions
- 3D transforms

---

## 🔄 **Estado de la Aplicación**

### **React Context Structure**
```typescript
UnifiedDataContextType {
  events: Event[]
  djs: DJ[]
  clubs: Club[]
  promoters: Promoter[]
  users: User[]
  loading: boolean
  connectionStatus: 'supabase' | 'cms-only' | 'loading' | 'error'
  // ... funciones de búsqueda y utilidad
}
```

---

## 🚀 **Deploy Checklist**

### **Pre-Deploy**
- [ ] `npm run type-check` sin errores
- [ ] `npm run build:prod` exitoso
- [ ] Verificar rutas funcionan correctamente
- [ ] Test en diferentes dispositivos
- [ ] Verificar performance (Lighthouse)

### **Post-Deploy**
- [ ] SSL configurado correctamente
- [ ] Cache headers configurados
- [ ] Analytics configurado
- [ ] Monitoreo de errores
- [ ] Backup de base de datos

---

## 📊 **Métricas de Performance**

### **Targets de Lighthouse**
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 85+

### **Bundle Size Targets**
- **Initial bundle**: < 200KB gzipped
- **Total assets**: < 1MB
- **First paint**: < 1.5s
- **Interactive**: < 3s

---

## 🔗 **URLs de Producción**

- **Principal**: https://calendaribiza.sunandfloweragency.com
- **CMS**: https://calendaribiza.sunandfloweragency.com/cms
- **Eventos**: https://calendaribiza.sunandfloweragency.com/events
- **DJs**: https://calendaribiza.sunandfloweragency.com/djs

---

## 👥 **Soporte y Mantenimiento**

Para soporte técnico o actualizaciones del calendario, contactar con el equipo de desarrollo.

### **Logs y Debugging**
- Console logs solo en desarrollo
- Error boundaries para producción
- Tracking de performance metrics

---

**🌅 Sun and Flower - Ibiza Electronic Music Calendar**  
*Versión 1.0.0 - Optimizado para producción*
