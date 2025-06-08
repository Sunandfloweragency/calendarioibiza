# 🌅 Ibiza Calendar - Sun and Flower

Calendario de eventos de música electrónica para Ibiza. Aplicación React optimizada y profesional con arquitectura limpia.

## 🚀 **Características**

- **🎵 Eventos de música electrónica** - Calendario completo de Ibiza
- **📱 Responsive Design** - Mobile first con adaptación automática
- **🎨 Interfaz moderna** - Efectos 3D, holográficos y animaciones con paleta de marca
- **⚡ Alta performance** - Carga rápida y navegación fluida
- **💾 Sistema híbrido** - localStorage + Supabase inteligente
- **🔍 Búsqueda avanzada** - Filtros por DJ, club, promoter, fecha
- **🌐 Multi-idioma** - Soporte i18next
- **🔐 CMS integrado** - Panel de administración con autenticación

---

## 🛠 **Stack Tecnológico**

- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Routing**: React Router 6 (con future flags)
- **Bundler**: Vite 6
- **Base de datos**: Supabase (PostgreSQL)
- **Persistencia**: Sistema híbrido inteligente
- **Iconos**: Heroicons
- **Idiomas**: i18next
- **Analytics**: Vercel Analytics + Speed Insights

---

## 🎨 **Paleta de Colores de Marca**

```css
Negro: #000000
Naranja: #ff9000  
Azul/Morado: #5b3ee4
```

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
cd nuevo-calendar

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
npm run build:deploy     # Build para despliegue
npm run preview          # Preview del build
npm run type-check       # Verificar tipos TypeScript
npm run clean            # Limpiar cache y dist
```

---

## 📁 **Estructura del Proyecto (Limpia)**

```
src/
├── 📁 components/          # Componentes React
│   ├── 📁 3D/             # Efectos 3D (Calendar3D, FloatingElements, etc.)
│   ├── 📁 admin/          # Panel de administración
│   ├── 📁 cms/            # Sistema de gestión de contenido
│   └── 📁 common/         # Componentes reutilizables
├── 📁 contexts/           # React Context (AuthContext, DataContext)
├── 📁 hooks/              # Custom hooks (useAuth, useBreakpoint, useStableData)
├── 📁 lib/                # Configuración Supabase centralizada
├── 📁 pages/              # Páginas principales
├── 📁 services/           # Servicios API (supabaseService, cmsService)
├── 📁 types/              # Tipos TypeScript
├── 📁 utils/              # Utilidades (migración)
├── 📄 App.tsx             # Componente principal
├── 📄 main.tsx            # Entry point
├── 📄 styles.css          # Estilos globales + Tailwind
├── 📄 constants.ts        # Constantes de la aplicación
└── 📄 i18n.ts             # Configuración de idiomas
```

---

## 🎯 **Funcionalidades Principales**

### 🏠 **Homepage**
- Hero section con animaciones profesionales
- Vista automática: móvil = lista, desktop = calendario 3D
- Eventos próximos con tarjetas holográficas

### 📅 **Calendario 3D**
- Vista mensual interactiva con efectos visuales
- Tooltips informativos
- Navegación fluida entre meses
- Responsive design automático

### 🎭 **Perfiles Completos**
- **DJs**: Biografía, géneros, eventos, redes sociales
- **Clubs**: Ubicación, capacidad, eventos, galería
- **Promoters**: Historia, eventos organizados

### 🔐 **CMS Integrado**
- Panel de administración protegido
- Gestión de usuarios y roles
- Aprobación de contenido
- Migración de datos localStorage ↔ Supabase

---

## 💾 **Sistema de Datos Híbrido Inteligente**

### **Detección Automática**
```typescript
// El sistema detecta automáticamente la fuente de datos
const hasSupabaseData = await checkSupabaseData();
if (hasSupabaseData) {
  // Usar Supabase
} else {
  // Usar localStorage
}
```

### **Migración Transparente**
- Migración automática localStorage → Supabase
- Cambio de fuente sin intervención del usuario
- Indicador visual del estado de datos (desarrollo)

---

## 🚀 **Optimizaciones Implementadas**

### **Arquitectura Limpia**
- ✅ Eliminados archivos duplicados
- ✅ Una sola instancia de Supabase
- ✅ Componentes unificados
- ✅ Dependencias optimizadas
- ✅ Estructura de carpetas ordenada

### **Performance**
- ✅ Bundle splitting automático
- ✅ Lazy loading de páginas
- ✅ React memoization
- ✅ Tailwind CSS purging
- ✅ Imágenes optimizadas

### **Warnings Eliminados**
- ✅ React Router future flags configurados
- ✅ Una sola instancia de GoTrueClient
- ✅ Renderizado único de la aplicación
- ✅ Tipos TypeScript completos

---

## 🔧 **Configuración para Producción**

### **Environment Variables**
```env
NODE_ENV=production
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-key>
VITE_SUPABASE_SERVICE_KEY=<your-service-key>
```

### **Despliegue**
```bash
# Build optimizado
npm run build:deploy

# El dist/ resultante está listo para cualquier hosting
```

---

## 📱 **Responsive Design**

```css
Mobile: < 768px    (Lista de eventos)
Tablet: 768-1024px (Calendario compacto)
Desktop: > 1024px  (Calendario 3D completo)
```

---

## 🔐 **Autenticación y Roles**

- **Usuario**: Puede ver contenido y enviar sugerencias
- **Moderador**: Puede aprobar contenido
- **Admin**: Control total del sistema

---

## 🎨 **Componentes 3D Incluidos**

- **Calendar3D**: Calendario principal con efectos visuales
- **FloatingElements**: Partículas animadas de fondo
- **HolographicCard**: Tarjetas con efecto holográfico
- **NeonButton**: Botones con efectos neón

---

## 📊 **Analytics Integrados**

- Vercel Analytics para métricas de uso
- Speed Insights para rendimiento
- Tracking de eventos personalizado

---

## 🚀 **Próximas Mejoras**

- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Integración con redes sociales
- [ ] API pública para terceros

---

**Desarrollado con ❤️ para la escena electrónica de Ibiza**
