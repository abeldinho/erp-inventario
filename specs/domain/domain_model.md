# Domain Model — Inventory Management System

## 🎯 Objetivo
Definir las entidades principales del sistema, sus atributos, relaciones y reglas de negocio para soportar la implementación del inventario.

---

# 🧩 Entidades

## 📦 Producto

### Descripción
Representa un ítem almacenado en el inventario.

### Atributos
- id: integer (PK)
- nombre: string (obligatorio)
- descripcion: string (opcional)
- sku: string (único, obligatorio)
- categoria_id: integer (FK → Categoria.id)
- precio: decimal (>= 0)
- stock_actual: integer (>= 0)
- stock_minimo: integer (>= 0)
- activo: boolean (default: true)
- created_at: datetime
- updated_at: datetime

### Reglas de negocio
- SKU debe ser único.
- No puede tener stock negativo.
- Debe pertenecer a una categoría activa.

---

## 📂 Categoria

### Descripción
Clasifica productos dentro del sistema.

### Atributos
- id: integer (PK)
- nombre: string (único, obligatorio)
- descripcion: string (opcional)
- activo: boolean (default: true)
- created_at: datetime

### Reglas de negocio
- Nombre debe ser único.
- No se elimina físicamente (soft delete).

---

## 📥 MovimientoInventario

### Descripción
Registra cambios en el stock de un producto.

### Atributos
- id: integer (PK)
- producto_id: integer (FK → Producto.id)
- tipo: enum ("entrada", "salida")
- cantidad: integer (> 0)
- motivo: string
- fecha_hora: datetime
- usuario: string
- stock_resultante: integer

### Reglas de negocio
- No permite stock negativo.
- Siempre debe registrar trazabilidad completa.
- Cada movimiento afecta el stock del producto.

---

## ⚙️ ConfiguracionSistema

### Descripción
Guarda configuraciones generales del sistema.

### Atributos
- id: integer (PK)
- clave: string (único)
- valor: string

---

# 🔗 Relaciones

## Categoria → Producto
- Tipo: 1 a N
- Una categoría puede tener muchos productos
- Un producto pertenece a una sola categoría

## Producto → MovimientoInventario
- Tipo: 1 a N
- Un producto puede tener muchos movimientos
- Un movimiento pertenece a un producto

---

# 📐 Reglas Globales

- No existe eliminación física (soft delete en todas las entidades principales).
- Toda operación debe mantener integridad referencial.
- El stock se calcula en base a movimientos o se mantiene actualizado.
- El sistema debe ser compatible con SQLite y PostgreSQL.

---

# 🚀 Preparado para
- Generación de modelos SQLAlchemy
- Generación de schemas Pydantic
- Construcción de endpoints FastAPI
- Generación automática con IA (Continue / GPT / Claude)