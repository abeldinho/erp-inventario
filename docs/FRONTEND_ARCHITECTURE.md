# 🖥️ Arquitectura Frontend - Inventory Manager

Descripción detallada de la arquitectura, tecnologías y patrones del frontend.

---

## 📐 Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (React)                          │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   React Components                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pages: Dashboard, Productos, Categorias,            │   │
│  │         Movimientos, Historial, Alertas              │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Components: Forms, Tables, Modals, Cards            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Custom Hooks                              │
│  - useProductos     - useCategorias                        │
│  - useMovimientos   - useDashboard                         │
│  - useHistorialMovimientos - useAlertasStock               │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (Axios)                         │
│  - client.ts        - productos.ts                         │
│  - categorias.ts    - movimientos.ts                       │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               Backend (FastAPI - HTTP)                     │
│  /api/productos - /api/categorias - /api/movimientos       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Directorios

```
frontend/src/
├── main.tsx                         # Entry point
├── App.tsx                          # Root component
├── index.css                        # Global styles (Tailwind)
│
├── api/                             # Capa de comunicación HTTP
│   ├── client.ts                    # Axios instance configurado
│   ├── productos.ts                 # Endpoints de productos
│   ├── categorias.ts               # Endpoints de categorías
│   └── movimientos.ts               # Endpoints de movimientos
│
├── router/                          # Configuración de rutas
│   └── AppRouter.tsx               # Routes con React Router
│
├── layout/                          # Layout principal
│   ├── AppLayout.tsx               # Layout con sidebar
│   └── Sidebar.tsx                 # Navegación lateral
│
├── modules/                         # Módulos por dominio
│   ├── dashboard/
│   │   ├── pages/DashboardPage.tsx
│   │   ├── components/
│   │   │   ├── StatCard.tsx
│   │   │   ├── TopProductos.tsx
│   │   │   └── StockAlert.tsx
│   │   ├── hooks/useDashboard.ts
│   │   └── types/dashboard.ts
│   │
│   ├── productos/
│   │   ├── pages/ProductosPage.tsx
│   │   ├── components/
│   │   │   ├── ProductoTable.tsx
│   │   │   └── ProductoForm.tsx
│   │   ├── hooks/useProductos.ts
│   │   ├── schemas/producto.schema.ts
│   │   └── types/producto.ts
│   │
│   ├── categorias/
│   │   ├── pages/CategoriasPage.tsx
│   │   ├── components/
│   │   │   ├── CategoriaTable.tsx
│   │   │   └── CategoriaForm.tsx
│   │   ├── hooks/useCategorias.ts
│   │   ├── schemas/categorias.schema.ts
│   │   └── types/categoria.ts
│   │
│   └── movimientos/
│       ├── pages/
│       │   ├── MovimientosPage.tsx
│       │   ├── HistorialPage.tsx
│       │   └── AlertasStockPage.tsx
│       ├── components/
│       │   ├── MovimientoForm.tsx
│       │   ├── MovimientoTable.tsx
│       │   ├── HistorialMovimientos.tsx
│       │   ├── AlertasTable.tsx
│       │   ├── AlertaBadge.tsx
│       │   ├── FiltrosHistorial.tsx
│       │   └── MovimientoDetalleModal.tsx
│       ├── hooks/
│       │   ├── useMovimientos.ts
│       │   ├── useHistorialMovimientos.ts
│       │   └── useAlertasStock.ts
│       ├── schemas/movimiento.schema.ts
│       └── types/
│           ├── movimientos.ts
│           └── alerta.ts
│
├── shared/                          # Componentes reutilizables
│   ├── components/ui/
│   │   ├── Input.tsx               # Input personalizado
│   │   ├── Select.tsx              # Select personalizado
│   │   ├── ConfirmModal.tsx        # Modal de confirmación
│   │   └── toast/
│   │       ├── Toast.tsx
│   │       └── ToastContainer.tsx
│   ├── hooks/
│   │   └── useToast.ts             # Hook para notificaciones
│   └── context/
│       └── ToastContext.tsx        # Contexto de toasts
│
└── types/                           # Tipos globales
    ├── producto.ts
    ├── categoria.ts
    └── movimientos.ts
```

---

## 🛠️ Tecnologías

| Tecnología | Propósito |
|-------------|-----------|
| **React 18** | UI Framework |
| **TypeScript** | Tipado estático |
| **Vite** | Build tool |
| **Tailwind CSS** | Estilos |
| **Axios** | HTTP Client |
| **React Router** | Navegación |
| **React Hook Form** | Formularios |
| **Zod** | Validación schemas |
| **@hookform/resolvers** | Integración Zod + RHF |

---

## 🔄 Flujo de Datos

### Ejemplo: Crear un Producto

```
1. USER: Hace click en "Nuevo Producto"
   ↓
2. COMPONENT: ProductosPage abre modal
   ↓
3. COMPONENT: ProductoForm renderiza
   ↓
4. USER: Completa y envía formulario
   ↓
5. REACT HOOK FORM: Valida con Zod schema
   ↓
6. useProductos.create(data) → createProducto(data)
   ↓
7. API: axios.post('/api/productos', data)
   ↓
8. BACKEND: FastAPI procesa request
   ↓
9. API: Retorna response (201 Created)
   ↓
10. useProductos: Recarga lista de productos
   ↓
11. UI: Tabla se actualiza con nuevo producto
```

---

## 🎯 Patrones Implementados

### 1. Custom Hooks (Data Fetching)
```typescript
// useProductos.ts
export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  
  const load = async () => {
    const data = await getProductos();
    setProductos(data);
  };

  const create = async (data: ProductoCreate) => {
    await createProducto(data);
    await load();  // Recarga después de mutation
  };

  return { productos, load, create };
}
```

### 2. Separación de Concerns por Módulo
```
cada módulo tiene:
├── pages/        → Componentes de página
├── components/    → Componentes visuales
├── hooks/        → Lógica de negocio
├── schemas/      → Validación Zod
└── types/        → TypeScript interfaces
```

### 3. API Layer Centralizada
```typescript
// api/productos.ts
export const getProductos = () => api.get("/productos");
export const createProducto = (data) => api.post("/productos", data);
export const updateProducto = (id, data) => api.put(`/productos/${id}`, data);
```

### 4. Formularios con React Hook Form + Zod
```typescript
const { register, handleSubmit } = useForm<ProductoCreateFormData>({
  resolver: zodResolver(productoCreateSchema)
});
```

---

## 📡 Integración con Backend

### Endpoints Consumidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Listar productos |
| POST | `/api/productos` | Crear producto |
| PUT | `/api/productos/{id}` | Actualizar producto |
| DELETE | `/api/productos/{id}` | Desactivar producto |
| GET | `/api/productos/alertas/stock-bajo` | Alertas de stock |
| GET | `/api/categorias` | Listar categorías |
| POST | `/api/categorias` | Crear categoría |
| PUT | `/api/categorias/{id}` | Actualizar categoría |
| DELETE | `/api/categorias/{id}` | Desactivar categoría |
| GET | `/api/movimientos` | Listar movimientos |
| POST | `/api/movimientos/entradas` | Registrar entrada |
| POST | `/api/movimientos/salidas` | Registrar salida |
| GET | `/api/movimientos/historial` | Historial con filtros |

### Manejo de Errores
```typescript
try {
  await createProducto(data);
} catch (err: any) {
  showError(err?.response?.data?.detail || "Error al crear");
}
```

---

## 🎨 Sistema de UI

### Componentes Base
- **Input**: Campo de texto con label y error
- **Select**: Dropdown con opciones
- **ConfirmModal**: Modal de confirmación genérico
- **Toast**: Notificaciones de éxito/error

### Integración de Toast
```typescript
// Proveedor en App.tsx
<ToastProvider>
  <AppRouter />
</ToastProvider>

// Uso en componentes
const { showSuccess, showError } = useToast();
showSuccess("Producto creado");
```

---

## 🚦 Navegación

```
/                   → Redirect a /dashboard
/dashboard          → Dashboard con estadísticas
/productos          → Lista de productos
/categorias         → Lista de categorías
/movimientos        → Registro de entradas/salidas
/movimientos/historial → Historial con filtros
/movimientos/alertas  → Productos con stock bajo
```

---

## 🔐 Validación de Formularios

### Schemas Zod por Operación

**Crear Producto (todos obligatorios)**
```typescript
productoCreateSchema = productoSchema.extend({
  sku: z.string().min(1)
});
```

**Actualizar Producto (todos opcionales)**
```typescript
productoUpdateSchema = productoSchema.partial();
```

### Mensajes de Error
- Mostrados debajo de cada campo
- Traducidos al español
- Personalizables por campo

---

## 📊 Estados de Carga

### Loading States
```typescript
const { productos, loading, load } = useProductos();

if (loading) return <Spinner />;
return <ProductoTable productos={productos} />;
```

### Manejo de Errores
- Console.error para debugging
- Toast de error para usuario
- Retry manual disponible

---

## 🧪 Testing (Futuro)

### Estrategias Consideradas
- **Vitest** para unit tests
- **React Testing Library** para componentes
- **MSW** para mock de API

### Áreas a Testear
- Custom hooks
- Componentes de formulario
- Validación de schemas
- Integración con API

---

## 📈 Performance

### Optimizaciones Implementadas
- **React.memo** en componentes pesados
- **useCallback/useMemo** para funciones/valores estables
- **Lazy loading** de rutas (React Router)

### Recomendaciones Futuras
- Pagination para tablas grandes
- Virtualización para listados largos
- Code splitting por módulo

---

## 🔄 Ciclo de Vida de una Mutación

```
1. Usuario envía formulario
   ↓
2. React Hook Form valida
   ↓
3. Hook (useProductos) llama API
   ↓
4. API layer ejecuta request
   ↓
5. Backend procesa y responde
   ↓
6. Hook recarga datos (load())
   ↓
7. UI actualiza automáticamente
   ↓
8. Toast muestra resultado
```

---

## 🛠️ Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Linting
npm run lint
```

---

**Versión**: 1.0.0  
**Última actualización**: 2024