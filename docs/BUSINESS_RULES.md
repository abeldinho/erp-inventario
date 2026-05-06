# 🔐 Reglas de Negocio - Inventory Manager

Documento que describe todas las reglas de negocio implementadas en el sistema.

---

## 📚 Tabla de Contenidos

1. [Gestión de Productos](#gestión-de-productos)
2. [Gestión de Categorías](#gestión-de-categorías)
3. [Movimientos de Inventario](#movimientos-de-inventario)
4. [Stock y Alertas](#stock-y-alertas)
5. [Persistencia de Datos](#persistencia-de-datos)
6. [API y Comunicación](#api-y-comunicación)

---

## 📦 Gestión de Productos

### RN-01: SKU Único
- **Descripción**: El SKU (Stock Keeping Unit) de cada producto debe ser único en el sistema.
- **Implementación**: Constraint `UNIQUE` en tabla `productos`, validación en `ProductoService.crear_producto()`.
- **Error**: `409 Conflict` si se intenta crear con SKU duplicado.
- **Ejemplo**:
  ```
  ✓ Permitido: SKU = "LAPTOP-001"
  ✗ No permitido: SKU = "LAPTOP-001" (ya existe)
  ```

### RN-02: Productos Inactivos Ocultos
- **Descripción**: Los productos con `activo = false` no deben aparecer en vistas principales.
- **Implementación**: Filtro `WHERE activo = true` en todas las queries de lectura.
- **Ubicación**: `ProductoService.listar_productos()`, `ProductoService.obtener_producto()`.
- **Excepción**: Pueden consultarse en funciones administrativas o auditorías.

### RN-03: Precio No Negativo
- **Descripción**: El precio de un producto nunca puede ser negativo.
- **Implementación**: Validación Pydantic `precio >= 0`, constraint en BD.
- **Error**: `422 Unprocessable Entity` si se intenta crear/actualizar con precio < 0.

### RN-04: Categoría Activa Requerida
- **Descripción**: Todo producto debe pertenecer a una categoría activa.
- **Implementación**: FK con validación en `ProductoService.crear_producto()` y `actualizar_producto()`.
- **Error**: `400 Bad Request` si la categoría no existe o está inactiva.
- **Ejemplo**:
  ```python
  # ✗ No permitido
  producto = Producto(categoria_id=999)  # No existe
  
  # ✓ Permitido
  producto = Producto(categoria_id=1)  # Existe y activa
  ```

### RN-05: Stock Inicial No Negativo
- **Descripción**: El stock inicial de un producto debe ser >= 0.
- **Implementación**: Validación Pydantic `stock_inicial >= 0`.
- **Error**: `422 Unprocessable Entity`.

### RN-06: Stock Actual Calculado
- **Descripción**: El `stock_actual` se calcula basándose en movimientos o se mantiene actualizado.
- **Implementación**: Actualización automática en cada movimiento (entrada/salida).
- **Importante**: No se actualiza directamente, solo a través de movimientos.

---

## 🏷️ Gestión de Categorías

### RN-07: Nombre de Categoría Único
- **Descripción**: El nombre de cada categoría debe ser único.
- **Implementación**: Constraint `UNIQUE` en tabla `categorias`, validación en `CategoriaService`.
- **Error**: `409 Conflict` si se intenta crear/renombrar a nombre duplicado.

### RN-08: Categorías Inactivas No Asignables
- **Descripción**: Las categorías inactivas no pueden asignarse a nuevos productos.
- **Implementación**: Validación en `ProductoService.crear_producto()` y `actualizar_producto()`.
- **Error**: `400 Bad Request`.

### RN-09: Soft Delete en Categorías
- **Descripción**: Las categorías nunca se eliminan físicamente, solo se marcan como inactivas.
- **Implementación**: `DELETE /api/categorias/{id}` setea `activo = false`.
- **Beneficio**: Se mantiene la integridad histórica y referencial.

---

## 📥 Movimientos de Inventario

### RN-10: Cantidad Mayor que Cero
- **Descripción**: Toda cantidad en un movimiento debe ser > 0.
- **Implementación**: Validación Pydantic `cantidad > 0`.
- **Error**: `422 Unprocessable Entity`.
- **Nota**: Esto previene movimientos "nulos" y mantiene la trazabilidad clara.

### RN-11: Stock Nunca Negativo ⚠️ CRÍTICA
- **Descripción**: El stock de un producto nunca puede ser negativo.
- **Implementación**: Validación en `MovimientoService.registrar_salida()` antes de crear movimiento.
- **Error**: `400 Bad Request` (InsufficientStockError).
- **Fórmula**: `stock_actual >= cantidad_solicitada` para salidas.
- **Ejemplo**:
  ```
  stock_actual = 10
  cantidad_salida = 15
  
  ✗ No permitido: 10 - 15 = -5 (negativo)
  Error: "Stock insuficiente para 'Laptop'. Disponible: 10, Solicitado: 15"
  ```

### RN-12: Producto Inactivo Sin Movimientos
- **Descripción**: Los productos inactivos no pueden recibir nuevos movimientos.
- **Implementación**: Validación en `ProductoService.validar_producto_activo()`.
- **Error**: `400 Bad Request`.
- **Justificación**: Evita registrar operaciones en productos descontinuados.

### RN-13: Trazabilidad Completa
- **Descripción**: Todo movimiento debe registrar: fecha/hora, usuario, motivo, tipo y stock resultante.
- **Implementación**: Campos obligatorios en `MovimientoInventario`.
- **Beneficio**: Auditoría completa y debugging de inconsistencias.

### RN-14: Stock Actualizado Inmediatamente ⚠️ CRÍTICA
- **Descripción**: Al registrar un movimiento, el `stock_actual` se actualiza al instante.
- **Implementación**: En una transacción atómica dentro de `registrar_entrada()` y `registrar_salida()`.
- **Atomicidad**: Garantiza que el movimiento y la actualización van juntos (no hay "huecos").
- **Ejemplo**:
  ```
  1. stock_actual = 100
  2. Registra salida de 30
  3. Transacción inicia
  4. Crea MovimientoInventario
  5. Actualiza stock_actual = 70
  6. Transacción commit
  ```

### RN-15: Historial Ordenado Descendente
- **Descripción**: El historial de movimientos se ordena por fecha descendente (más recientes primero).
- **Implementación**: `ORDER BY fecha_hora DESC` en `obtener_historial_producto()`.
- **Query**: `MovimientoInventario.fecha_hora.desc()`.

### RN-16: Sin Consulta de Historial sin Producto
- **Descripción**: No se permite consultar historial sin especificar un producto.
- **Implementación**: `producto_id` es parámetro obligatorio en `/api/movimientos/historial/{producto_id}`.
- **Error**: `404 Not Found` si producto no existe.

### RN-17: Trazabilidad en Respuestas
- **Descripción**: Cada registro del historial incluye `stock_resultante` para garantizar trazabilidad.
- **Implementación**: Campo `stock_resultante` se registra al crear movimiento.
- **Utilidad**: Permite auditar cómo llegó el stock a su valor actual.

---

## 📊 Stock y Alertas

### RN-18: Stock Mínimo Configurable
- **Descripción**: Todo producto debe tener un valor de `stock_minimo` para activar alertas.
- **Implementación**: Campo `stock_minimo >= 0` en tabla `productos`.
- **Default**: 0 (sin alerta).
- **Uso**: Para determinar qué productos están "bajo stock".

### RN-19: No Alertar Inactivos
- **Descripción**: Los productos inactivos no deben aparecer en alertas de stock bajo.
- **Implementación**: Filtro `WHERE activo = true` en `obtener_productos_stock_bajo()`.

### RN-20: Estándar Visual para Alertas
- **Descripción**: Las alertas de stock bajo se identifican de forma consistente.
- **Implementación**: Campo `diferencia = stock_actual - stock_minimo` (negativo = alerta).
- **Visualización**: Color rojo en frontend (no implementado aún).

### RN-21: Auditoría de Cambios de Mínimo
- **Descripción**: Todo ajuste de `stock_minimo` debe registrarse con fecha y usuario.
- **Implementación**: Campos `updated_at` en tabla `productos` + logs opcionales.
- **Nota**: Implementación futura si se requiere mayor detalle.

### RN-22: Cálculo de Alerta
- **Descripción**: Un producto está en alerta si `stock_actual < stock_minimo`.
- **Fórmula**: `stock_actual < stock_minimo AND stock_minimo > 0`.
- **Ejemplo**:
  ```
  Producto A: stock_actual=5, stock_minimo=10  → ALERTA
  Producto B: stock_actual=15, stock_minimo=10 → OK
  Producto C: stock_actual=0, stock_minimo=0   → OK (no configurado)
  ```

---

## 💾 Persistencia de Datos

### RN-23: Base de Datos SQL
- **Descripción**: Los datos se persisten en base de datos SQL.
- **Desarrollo**: SQLite (archivo `inventory.db`).
- **Producción**: PostgreSQL recomendado.
- **ORM**: SQLAlchemy para abstracción.

### RN-24: Integridad Referencial
- **Descripción**: Se mantiene integridad referencial entre entidades.
- **Implementación**:
  - `Producto.categoria_id` → `Category.id` (FK)
  - `MovimientoInventario.producto_id` → `Producto.id` (FK)
  - Cascadas de eliminación lógica (soft delete).

### RN-25: Transacciones ACID
- **Descripción**: Las operaciones críticas se ejecutan en transacciones ACID.
- **Operaciones Afectadas**:
  - Crear movimiento + actualizar stock
  - Cambios en categoría con productos asociados
- **Garantía**: Consistencia total (no hay estados intermedios inconsistentes).

### RN-26: Soft Delete (Borrado Lógico)
- **Descripción**: NUNCA se eliminan datos físicamente, solo se marcan como inactivos.
- **Implementación**: Campo `activo = boolean` en `categorias` y `productos`.
- **Regla de Oro**: `DELETE /api/.../{id}` setea `activo = false`, no ejecuta SQL `DELETE`.
- **Beneficio**:
  - Auditoría histórica intacta
  - No se pierden relaciones
  - Cumple con retención de datos
- **Ejemplo**:
  ```sql
  -- ✗ NUNCA hacer:
  DELETE FROM productos WHERE id = 1;
  
  -- ✓ SIEMPRE hacer:
  UPDATE productos SET activo = false WHERE id = 1;
  ```

### RN-27: Migración SQLite → PostgreSQL
- **Descripción**: El cambio de BD debe requerir solo cambio de configuración.
- **Implementación**: Variable `DATABASE_URL` en `.env`.
- **No Requiere**: Cambios en código de lógica de negocio.
- **Ejemplo**:
  ```env
  # Desarrollo
  DATABASE_URL=sqlite:///./inventory.db
  
  # Producción
  DATABASE_URL=postgresql://user:pass@host:5432/inventory
  ```

---

## 🌐 API y Comunicación

### RN-28: Códigos HTTP Estándar
- **Descripción**: La API devuelve códigos HTTP semánticamente correctos.
- **Implementación**:
  | Código | Caso | Implementación |
  |--------|------|---|
  | 200 | GET exitoso | Lectura completada |
  | 201 | POST exitoso | Recurso creado |
  | 400 | Bad Request | Datos inválidos, stock insuficiente |
  | 404 | Not Found | Recurso no existe |
  | 409 | Conflict | Duplicado (SKU, nombre categoría) |
  | 422 | Unprocessable Entity | Validación Pydantic fallida |
  | 500 | Server Error | Error inesperado en servidor |

### RN-29: JSON como Formato Exclusivo
- **Descripción**: La API solo acepta y devuelve JSON.
- **Headers**: `Content-Type: application/json`.
- **Implementación**: FastAPI automáticamente.

### RN-30: Validación Pydantic en Entrada
- **Descripción**: Todos los requests se validan con Pydantic schemas.
- **Casos**:
  - Tipos de datos correctos
  - Rangos válidos (ej: precio >= 0)
  - Campos obligatorios presentes
  - Longitudes de strings respetadas
- **Error**: `422 Unprocessable Entity` con detalles del error.

### RN-31: Rutas RESTful
- **Descripción**: Los endpoints siguen convenciones REST.
- **Patrones**:
  | Método | Ruta | Acción |
  |--------|------|--------|
  | POST | `/api/resource` | Crear |
  | GET | `/api/resource` | Listar |
  | GET | `/api/resource/{id}` | Obtener |
  | PUT | `/api/resource/{id}` | Actualizar |
  | DELETE | `/api/resource/{id}` | Desactivar |
  | POST | `/api/resource/action` | Acción especial |

### RN-32: Sin Autenticación (v1.0)
- **Descripción**: La versión actual no implementa autenticación.
- **Supuesto**: Usuario único implícito.
- **Futuro**: Token JWT o OAuth2 si es requerido.
- **Seguridad Alternativa**: Desplegar en red privada o con firewall.

---

## 🔍 Validaciones Cruzadas

### Creación de Producto
```
✓ Validaciones aplicadas:
1. SKU único (RN-01)
2. Categoría existe y activa (RN-04)
3. Precio >= 0 (RN-03)
4. Stock inicial >= 0 (RN-05)
5. Nombre no vacío (Pydantic)
```

### Registrar Salida
```
✓ Validaciones aplicadas:
1. Producto existe y activo (RN-12)
2. Cantidad > 0 (RN-10)
3. Stock suficiente (RN-11)
4. Fecha no futura (Pydantic)
5. Motivo no vacío (Pydantic)

✓ Acciones:
1. Crea MovimientoInventario (RN-13)
2. Actualiza stock_actual (RN-14)
3. Registra stock_resultante (RN-13, RN-17)
4. Transacción atómica (RN-25)
```

### Consultar Historial
```
✓ Validaciones aplicadas:
1. Producto existe (RN-16)
2. Rango de fechas válido (desde <= hasta)
3. Filtros válidos (tipo: entrada/salida)

✓ Resultado:
1. Ordenado descendente por fecha (RN-15)
2. Incluye stock_resultante (RN-17)
3. Solo activos mostrados (RN-19 si aplica)
```

---

## 📌 Resumen de Reglas Críticas

Las siguientes reglas son **CRÍTICAS** y deben verificarse constantemente:

- **RN-11**: Stock nunca negativo ⚠️
- **RN-14**: Stock actualizado inmediatamente ⚠️
- **RN-26**: Soft delete obligatorio ⚠️

---

**Versión**: 1.0.0  
**Última actualización**: 2024
