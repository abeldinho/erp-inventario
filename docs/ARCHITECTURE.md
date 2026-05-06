# 🏗️ Arquitectura - Inventory Manager

Descripción detallada de la arquitectura, capas y patrones de diseño implementados.

---

## 📐 Diagrama General de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                      HTTP Client                             │
│            (Browser, Postman, Mobile App)                    │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Application                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Layer (routers/)                                │   │
│  │  - categorias.py    : CRUD categorías              │   │
│  │  - productos.py     : CRUD productos               │   │
│  │  - movimientos.py   : Entradas/Salidas/Historial   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│            Exception Handlers & Middleware                   │
│  - InventoryException → HTTP Response                        │
│  - Pydantic Validation → HTTP 422                            │
│  - CORS, Logging, etc.                                       │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Business Logic Layer (services/)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  - CategoriaService    : Lógica de categorías       │   │
│  │  - ProductoService     : Lógica de productos        │   │
│  │  - MovimientoService   : Lógica de movimientos      │   │
│  │                                                      │   │
│  │  Responsabilidades:                                  │   │
│  │  • Validaciones de negocio                           │   │
│  │  • Reglas de negocio (RN-*)                          │   │
│  │  • Transacciones                                     │   │
│  │  • Lanzamiento de excepciones                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         Validation Layer (schemas.py - Pydantic)            │
│  - Tipado de datos                                           │
│  - Validaciones de entrada                                   │
│  - Serialización de respuestas                               │
│  - Documentación automática                                  │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              ORM Layer (models.py - SQLAlchemy)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Models:                                             │   │
│  │  - Category         : Tabla categorias               │   │
│  │  - Producto         : Tabla productos                │   │
│  │  - MovimientoInv.   : Tabla movimientos_inventario   │   │
│  │  - ConfiguracionSis.: Tabla configuracion_sistema    │   │
│  │                                                      │   │
│  │  Responsabilidades:                                  │   │
│  │  • Mapeo objeto-relacional                           │   │
│  │  • Relaciones y FKs                                  │   │
│  │  • Constraints de BD                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│            Database Abstraction (db.py)                      │
│  - Engine (SQLAlchemy)                                       │
│  - SessionLocal factory                                      │
│  - Dependency injection (get_db)                             │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Database (SQLite / PostgreSQL)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  categorias                                          │   │
│  │  productos                                           │   │
│  │  movimientos_inventario                              │   │
│  │  configuracion_sistema                               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Directorios

```
src/
├── __init__.py                          # Metadatos del paquete
├── config.py                            # Configuración global
├── db.py                                # Conexión y sesión DB
├── models.py                            # Modelos SQLAlchemy
├── schemas.py                           # Schemas Pydantic
│
├── exceptions/
│   ├── __init__.py
│   └── custom_exceptions.py             # Excepciones personalizadas
│
├── services/                            # Lógica de negocio
│   ├── __init__.py
│   ├── categoria_service.py
│   ├── producto_service.py
│   └── movimiento_service.py
│
├── api/
│   ├── __init__.py
│   └── routers/                         # Endpoints
│       ├── __init__.py
│       ├── categorias.py                # GET/POST/PUT/DELETE /api/categorias
│       ├── productos.py                 # GET/POST/PUT/DELETE /api/productos
│       └── movimientos.py               # POST/GET /api/movimientos
│
└── utils/                               # Utilidades
    ├── __init__.py
    └── init_data.py                     # Datos de ejemplo

main.py                                  # FastAPI app + lifespan
```

---

## 🔄 Flujo de una Solicitud

### Ejemplo: Registrar una Salida de Stock

```
1. CLIENT: POST /api/movimientos/salidas
   {
     "producto_id": 1,
     "cantidad": 5,
     "motivo": "Venta",
     "usuario": "juan"
   }
   
2. FASTAPI (routers/movimientos.py)
   ├─ Recibe request
   ├─ Valida contra MovimientoSalida (Pydantic)
   │  └─ Si error → 422 Unprocessable Entity
   ├─ Inyecta db (get_db)
   └─ Llama MovimientoService.registrar_salida(db, movimiento)

3. SERVICE LAYER (services/movimiento_service.py)
   ├─ Valida producto activo
   │  └─ Si error → ResourceNotFoundError (404)
   ├─ Valida stock suficiente
   │  └─ Si error → InsufficientStockError (400)
   ├─ Inicia transacción
   ├─ Crea MovimientoInventario
   ├─ Actualiza Producto.stock_actual
   ├─ Commit (atómico)
   └─ Retorna MovimientoInventario

4. FASTAPI (routers/movimientos.py)
   ├─ Captura excepciones y las convierte a HTTP
   └─ Retorna respuesta JSON

5. CLIENT: Response 201 Created
   {
     "id": 1,
     "producto_id": 1,
     "tipo": "salida",
     "cantidad": 5,
     "motivo": "Venta",
     "fecha_hora": "2024-01-20T15:00:00",
     "usuario": "juan",
     "stock_resultante": 95
   }
```

---

## 🎯 Principios de Diseño

### 1. Separación de Responsabilidades
- **API Layer**: HTTP requests/responses
- **Service Layer**: Lógica de negocio y validaciones
- **ORM Layer**: Acceso a datos
- **Schema Layer**: Validación de entrada/serialización

### 2. Dependency Injection
```python
# FastAPI inyecta la sesión de BD
def obtener_categoria(
    categoria_id: int,
    db: Session = Depends(get_db)  # ← Inyectado
):
    return CategoriaService.obtener_categoria(db, categoria_id)
```

### 3. Excepciones Personalizadas
```python
# Service lanza excepciones específicas
try:
    CategoriaService.crear_categoria(db, categoria)
except DuplicateResourceError as e:
    # Router la convierte a HTTP 409
    raise HTTPException(status_code=e.status_code, detail=e.message)
```

### 4. Transacciones ACID
```python
# Service maneja transacciones automáticas
db.add(movimiento)
db.add(producto)  # Ambas cambios juntos
db.commit()       # Todo o nada
```

### 5. Type Hints Explícitos
```python
def obtener_producto(db: Session, producto_id: int) -> Producto:
    # Tipos claros para IDE autocompletion y validación
```

---

## 🔌 Patrones Implementados

### Service Pattern
```
Request → Router → Service → Models → DB
```

### Repository Pattern (Implícito)
- Services actúan como repositorios
- Queries encapsuladas en métodos específicos

### Data Transfer Object (DTO)
```python
ProductoCreate  # Input DTO
ProductoResponse  # Output DTO
```

### Dependency Injection
```python
def get_db():
    db = SessionLocal()
    yield db  # Inyectado a endpoints
```

---

## 💾 Modelo de Datos

### Relaciones

```
┌─────────────┐
│  CATEGORY   │
│─────────────│
│ id (PK)     │
│ nombre (U)  │ ────┐
│ activo      │     │
└─────────────┘     │
                    │  1:N
                    │
                    ▼
            ┌──────────────┐
            │  PRODUCTO    │
            │──────────────│
            │ id (PK)      │
            │ sku (U)      │
            │ categoria_id │ (FK)
            │ stock_actual │
            │ stock_min    │
            │ activo       │
            └──────────────┘
                    ▲
                    │  1:N
                    │
    ┌───────────────────────────┐
    │ MOVIMIENTO_INVENTARIO     │
    │───────────────────────────│
    │ id (PK)                   │
    │ producto_id (FK)          │
    │ tipo (enum)               │
    │ cantidad                  │
    │ motivo                    │
    │ fecha_hora                │
    │ usuario                   │
    │ stock_resultante          │
    └───────────────────────────┘
```

### Constraints Implementados

```sql
-- Única en productos
ALTER TABLE productos ADD CONSTRAINT uk_productos_sku 
  UNIQUE(sku);

-- Única en categorías
ALTER TABLE categorias ADD CONSTRAINT uk_categorias_nombre 
  UNIQUE(nombre);

-- Integridad referencial
ALTER TABLE productos ADD CONSTRAINT fk_productos_categoria 
  FOREIGN KEY(categoria_id) REFERENCES categorias(id);

ALTER TABLE movimientos_inventario ADD CONSTRAINT fk_mov_producto 
  FOREIGN KEY(producto_id) REFERENCES productos(id);

-- Índices para performance
CREATE INDEX idx_productos_sku ON productos(sku);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_mov_fecha ON movimientos_inventario(fecha_hora);
```

---

## 🧪 Estrategia de Testing

### Pirámide de Tests

```
        △
       △△  △△  (E2E - tests/test_*_api.py)
      △△△ △△△
     △△△△△△△△  (Integration - conftest.py fixtures)
    △△△△△△△△△△ (Unit - tests/test_*_service.py)
```

### Estructura
```
tests/
├── conftest.py                    # Fixtures compartidas
├── test_categoria_service.py      # Unit tests
├── test_producto_service.py       # Unit tests
└── test_movimiento_service.py     # Unit tests
```

### In-Memory Database
- Tests usan SQLite en memoria
- Cada test obtiene su propia sesión
- Aislamiento completo de datos

---

## 🔐 Medidas de Seguridad

### A Nivel de Aplicación
- Validación Pydantic obligatoria
- Type hints para prevenir errores
- Excepciones personalizadas bien manejadas
- Soft delete (no pérdida de datos)

### A Nivel de Base de Datos
- Constraints (UNIQUE, FK, CHECK)
- Integridad referencial
- Transacciones ACID

### A Nivel de Infraestructura
- Usuario no-root en Docker
- CORS configurable
- Healthcheck implementado

---

## 📊 Componentes Principales

### FastAPI App (`main.py`)
- Lifespan events (startup/shutdown)
- Exception handlers personalizados
- CORS middleware
- Routers incluidos

### Config (`src/config.py`)
- Settings desde variables de entorno
- Separación dev/prod
- Pydantic Settings (type-safe)

### Database (`src/db.py`)
- Engine creation
- Session factory
- Dependency injection helper

### Models (`src/models.py`)
- 4 modelos SQL: Category, Producto, MovimientoInventario, ConfiguracionSistema
- Relaciones bidireccionales
- Timestamps automáticos

### Schemas (`src/schemas.py`)
- Pydantic models para validación
- Separación Create/Update/Response
- Enums para tipos fijos

---

## 🚀 Escalabilidad

### Horizontal
- Stateless API (sesiones de BD son temporales)
- Múltiples instancias pueden correr en paralelo
- Load balancer distribuye requests

### Vertical
- Indexes en BD para queries rápidas
- Connection pooling en SQLAlchemy
- Lazy loading en relaciones

### Bases de Datos
- SQLite para desarrollo (simple)
- PostgreSQL para producción (escalable)
- Migración automática vía configuración

---

## 📈 Performance Considerations

### Índices Creados
```
- productos.sku (búsquedas por SKU)
- productos.activo (filtrado de activos)
- movimientos_inventario.fecha_hora (ordenamiento de historial)
- movimientos_inventario.producto_id (búsqueda por producto)
```

### Lazy Loading
- Relaciones `.back_populates` cargan bajo demanda
- No se cargan productos al obtener categoría (a menos que se acceda)

### Paginación (Futuro)
- GET endpoints pueden implementar limit/offset
- Para historial con millones de registros

---

## 🔄 Ciclo de Vida de una Transacción

```
1. Request llega a router
   ↓
2. DB session se abre (Depends(get_db))
   ↓
3. Service method se ejecuta
   ├─ Validaciones
   ├─ Queries
   ├─ db.add() / db.update()
   ├─ db.commit()
   └─ db.refresh()
   ↓
4. Response se construye
   ↓
5. DB session se cierra (finally)
   ↓
6. Response HTTP se envía
```

---

**Versión**: 1.0.0  
**Última actualización**: 2024
