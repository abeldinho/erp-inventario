# UC-01: Gestionar Productos

## 🎯 Propósito
Permitir al usuario crear, consultar, actualizar y desactivar productos manteniendo un registro consistente del inventario.

## 👤 Actor Principal
Usuario del sistema (versión sin autenticación).

## 📌 Precondiciones
- El sistema debe estar operativo.
- Debe existir al menos una categoría para asignar al producto.
- La base de datos debe estar inicializada.

## 📈 Flujo Principal (Exitoso)

### 1. Crear Producto
1. El usuario solicita crear un nuevo producto.
2. El sistema solicita los datos: nombre, descripción, categoría, SKU, precio y stock inicial.
3. El sistema valida que el **SKU sea único**.
4. El sistema registra el producto como **activo**.
5. El sistema confirma la creación.

### 2. Consultar Productos
1. El usuario solicita ver todos los productos.
2. El sistema muestra la lista de productos activos con:
   - nombre  
   - SKU  
   - categoría  
   - precio  
   - stock actual  
3. El sistema devuelve los datos ordenados por fecha de creación.

### 3. Actualizar Producto
1. El usuario solicita actualizar un producto.
2. El sistema muestra los atributos editables.
3. El usuario actualiza los datos.
4. El sistema valida los cambios.
5. El sistema guarda la actualización.

### 4. Desactivar Producto (Borrado lógico)
1. El usuario solicita desactivar un producto.
2. El sistema marca el producto como **inactivo**, sin eliminar historial.
3. El sistema oculta el producto de la lista principal (vista de activos).

---

## 🔀 Flujos Alternativos

### A1 — SKU Existente
- En el flujo de creación, si el SKU ya existe:
  - El sistema rechaza la creación.
  - Devuelve error `409 - Conflict`.
  - Permite reintentar con otro SKU.

### A2 — Categoría Inexistente
- Si el usuario intenta asignar una categoría que no existe:
  - El sistema muestra error `400 - Bad Request`.
  - Solicita elegir otra categoría.

### A3 — Producto Inactivo Consultado
- Si el usuario intenta ver o editar un producto inactivo:
  - El sistema muestra error `404 - Not Found`.

---

## 🔐 Reglas de Negocio

- RN-01: El SKU debe ser único en todo momento.
- RN-02: Los productos inactivos no deben aparecer en las vistas principales.
- RN-03: El precio debe ser un número mayor a cero.
- RN-04: Cada producto debe pertenecer a una categoría activa.
- RN-05: El stock inicial debe ser un número entero ≥ 0.

---

## 📤 Postcondiciones

- Producto registrado en la base de datos con estado “activo”.
- Actualización reflejada inmediatamente en consultas.
- Si se desactiva, queda oculto y solo visible en vistas administrativas o auditorías.
