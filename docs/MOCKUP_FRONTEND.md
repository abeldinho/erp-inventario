# 🎨 Mockup - Inventory Manager Frontend

## Paleta de Colores

| Propósito | Color | Uso |
|-----------|-------|-----|
| Primary | `#4F46E5` (Indigo-600) | Botones principales, links activos |
| Primary Hover | `#4338CA` (Indigo-700) | Estados hover |
| Secondary | `#6366F1` (Indigo-500) | Acentos, badges |
| Background | `#F8FAFC` (Slate-50) | Fondo general |
| Surface | `#FFFFFF` | Cards, modals |
| Surface Alt | `#F1F5F9` (Slate-100) | Alternas, tablas |
| Border | `#E2E8F0` (Slate-200) | Bordes, separadores |
| Text Primary | `#0F172A` (Slate-900) | Títulos |
| Text Secondary | `#64748B` (Slate-500) | Subtítulos, labels |
| Success | `#10B981` (Emerald-500) | Estados exitosos |
| Warning | `#F59E0B` (Amber-500) | Warnings |
| Danger | `#EF4444` (Red-500) | Errores, eliminar |

---

## 📱 Mobile First (< 640px)

### Layout Base
```
┌─────────────────────────────┐
│ ☰  Inventory Manager       │  Header fijo (56px)
├─────────────────────────────┤
│                             │
│   [Dashboard / Contenido]   │  Scrollable
│                             │
│                             │
│                             │
└─────────────────────────────┘

Sidebar: Slide-in desde izquierda (overlay oscuro)
```

### Header (Mobile)
```
┌─────────────────────────────┐
│ ☰ │ Inventory Manager  🔔  │  h-14, bg-white, shadow-sm
└─────────────────────────────┘
```

### Tabla Productos (Mobile)
```
┌─────────────────────────────┐
│ 🔍 Buscar...                 │  Input rounded-full
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Laptop ASUS             │ │  Card-style en mobile
│ │ SKU: LP-001  │ $599     │ │
│ │ Stock: 10    │ ⚠️ Bajo  │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Mouse Wireless           │ │
│ │ SKU: MS-002  │ $29      │ │
│ │ Stock: 50    │ ✅ OK    │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Botones (Mobile - Touch Friendly)
```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │    + Nuevo Producto     │ │  h-12 (48px min)
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## 💻 Desktop (≥ 1024px)

### Layout General
```
┌──────────────────────────────────────────────────────────────┐
│ HEADER: Logo + Título + Notificaciones + User                 │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                  │
│  SIDEBAR   │              CONTENIDO PRINCIPAL                 │
│  (240px)   │                                                  │
│            │  ┌────────────────────────────────────────────┐  │
│  Dashboard │  │  Page Header: Título + Acciones           │  │
│  Productos │  ├────────────────────────────────────────────┤  │
│  Categorías│  │                                            │  │
│  Movim.    │  │  [Tabla / Cards / Contenido]               │  │
│  Historial │  │                                            │  │
│  Alertas   │  │                                            │  │
│            │  └────────────────────────────────────────────┘  │
│            │                                                  │
└────────────┴─────────────────────────────────────────────────┘
```

### Dashboard (Desktop)
```
┌─────────────────────────────────────────────────────────────┐
│  📊 Dashboard                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 📦       │ │ 💰       │ │ ⚠️       │ │ 📈       │       │
│  │ Productos│ │ Valor    │ │ Stock    │ │ Movim.   │       │
│  │    156   │ │ $45,230  │ │    12    │ │    89    │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                             │
│  ┌─────────────────────────┐ ┌─────────────────────────┐   │
│  │ 🔝 Top Productos        │ │ ⚠️ Stock Bajo           │   │
│  │ ─────────────────────── │ │ ─────────────────────── │   │
│  │ 1. Laptop ASUS    25    │ │ • Teclado Mecánico 2/5  │   │
│  │ 2. Mouse Razer     18    │ │ • Monitor LG      1/10 │   │
│  │ 3. Monitor LG      15    │ │ • Webcam HD       3/8  │   │
│  │                      ▼   │ │                      ▼   │   │
│  └─────────────────────────┘ └─────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Tabla Productos (Desktop)
```
┌─────────────────────────────────────────────────────────────┐
│  Productos                    [🔍 Buscar] [+ Nuevo]       │
├─────────────────────────────────────────────────────────────┤
│ ┌─────┬──────────────┬─────────┬────────┬────────┬─────┐  │
│ │ SKU │ Nombre       │ Categor.│ Precio │ Stock  │ Act.│  │
│ ├─────┼──────────────┼─────────┼────────┼────────┼─────┤  │
│ │...  │ ...          │ ...     │ ...    │ ...    │ ... │  │
│ └─────┴──────────────┴─────────┴────────┴────────┴─────┘  │
│                                    ◄ 1 2 3 4 5 ►           │
└─────────────────────────────────────────────────────────────┘
```

### Modal (Desktop + Mobile)
```
┌─────────────────────────────────┐
│  ✕  Editar Producto      [X]  │  Header
├─────────────────────────────────┤
│                                 │
│  Nombre:  [_______________]    │
│  Descrip: [_______________]    │
│  SKU:     [_______________]    │
│  Precio:  [_______________]    │
│  Stock:   [_______________]     │
│  Categor: [▼ Seleccionar]     │
│                                 │
│  [Cancelar]  [Guardar]         │  Buttons (48px min height)
│                                 │
└─────────────────────────────────┘
```

---

## 🎯 Componentes con Estilo

### StatCard (Dashboard)
```tsx
// Desktop: grid-cols-4
// Mobile: grid-cols-2
<div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
  <div className="flex items-center justify-between">
    <div className="p-3 bg-indigo-50 rounded-lg">
      <Package className="w-6 h-6 text-indigo-600" />
    </div>
    <span className="text-green-500 text-sm">+12% ▲</span>
  </div>
  <div className="mt-4">
    <p className="text-2xl font-bold text-slate-900">156</p>
    <p className="text-sm text-slate-500">Productos</p>
  </div>
</div>
```

### Button Variants
```tsx
// Primary
<button className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
  Guardar
</button>

// Secondary  
<button className="px-4 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors">
  Cancelar
</button>

// Danger
<button className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors">
  Eliminar
</button>
```

### Input
```tsx
<div className="space-y-1.5">
  <label className="text-sm font-medium text-slate-700">Nombre</label>
  <input className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
</div>
```

### Badge/Status
```tsx
// Stock OK
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
  ✓ En stock
</span>

// Stock Bajo
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
  ⚠️ Bajo
</span>
```

---

## 📐 Responsive Breakpoints

| Breakpoint | Ancho | Layout |
|------------|-------|--------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop grande |

### Clases Responsive Típicas
```tsx
// Sidebar
hidden lg:block  // Oculto en mobile, visible en lg+

// Grid
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

// Text
text-sm sm:text-base

// Padding
p-4 sm:p-6 lg:p-8

// Table → Cards
lg:table-row hidden  // Table row en desktop
block lg:hidden       // Card en mobile
```

---

## 🔔 Feedback Visual

### Toast Notifications
```
┌─────────────────────────────────────────┐
│ ✓ Producto creado exitosamente    ✕   │  Success (green-50 border-green-200)
├─────────────────────────────────────────┤
│ ⚠️ El nombre es obligatorio       ✕   │  Error (red-50 border-red-200)
└─────────────────────────────────────────┘

Position: Top-right, fixed
Animation: Slide in + fade
Duration: 5 segundos
```

---

## 📋 Checklist de Implementación

- [ ] Colors: Actualizar tailwind.config.js
- [ ] Sidebar: Crear componente responsive
- [ ] Tables: Convertir a cards en mobile
- [ ] Buttons: Min-height 48px
- [ ] Forms: Labels + errores claros
- [ ] Modals: Full-screen en mobile
- [ ] Spacing: Consistent padding
- [ ] Shadows: Suaves (shadow-sm)
- [ ] Transitions: smooth properties
- [ ] Icons: Usar Lucide consistentemente

---

## ✨ Efectos y Animaciones

### Hover States
```css
/* Buttons */
transition: all 200ms ease-in-out;

/* Cards */
hover:shadow-md hover:-translate-y-0.5;

/* Table rows */
hover:bg-slate-50;
```

### Loading
```tsx
<div className="animate-pulse bg-slate-200 rounded h-4 w-3/4" />
```

### Page Transitions
```tsx
<div className="animate-fade-in">
  {/* contenido */}
</div>
```

---

¿Procedo con la implementación?