# UC-02: Gestionar Categorías

## 🎯 Propósito
Administrar categorías para clasificar productos, manteniendo unicidad y consistencia en el inventario.

## 👤 Actor Principal
Usuario del sistema (sin autenticación en esta versión).

## 📌 Precondiciones
- El sistema debe estar operativo.
- La base de datos debe estar inicializada.
- El nombre de categoría no debe existir previamente.
- Si una categoría está inactiva, sus productos no pueden seleccionarla al crear o editar.

---

## 📈 Flujo Principal (Exitoso)

### 1. Crear Categoría
1. El usuario solicita crear una nueva categoría.
2. El sistema solicita: nombre y descripción (opcional).
3. El sistema valida que el **nombre sea único**.
4. El sistema registra la categoría como **activa**.
5. El sistema confirma la creación.

### 2. Consultar Categorías
1. El usuario solicita ver todas las categorías activas.
2. El sistema muestra la lista con:
   - nombre  
   - descripción  
   - estado (activo/inactivo)  
3. El sistema devuelve la información ordenada alfabéticamente.

### 3. Actualizar Categoría
1. El usuario elige una categoría existente para editar.
2. El sistema muestra los campos disponibles para modificar.
3. El usuario realiza los cambios.
4. El sistema valida unicidad del nombre (si fue modificado).
5. El sistema guarda la actualización.

### 4. Desactivar Categoría
1. El usuario solicita desactivar una categoría.
2. El sistema cambia su estado a **inactiva**.
3. Los productos asociados **no se eliminan**, pero no podrán asignarse a esta categoría en el futuro.
4. El sistema confirma la acción.

---

## 🔀 Flujos Alternativos

### A1 — Nombre de Categoría Duplicado
- Si el usuario intenta crear o renombrar una categoría con un nombre ya existente:  
  - El sistema rechaza la operación.  
  - Devuelve error `409 - Conflict`.  
  - Solicita un nombre diferente.  

### A2 — Editar Categoría Inactiva
- Si el usuario intenta editar una categoría inactiva:  
  - El sistema retorna `404 - Not Found`.  
  - Solicita seleccionar una activa.

### A3 — Intentar Desactivar Categoría Crítica
*(Opcional según FR — puede implementarse si deseas)*  
- Si se decide que una categoría vinculada a productos activos no puede desactivarse:  
  - El sistema informa con `400 - Bad Request`.  
  - Sugiere reasignar los productos primero.

---

## 🔐 Reglas de Negocio

- **RN-01:** El nombre de la categoría debe ser único.
- **RN-02:** Una categoría inactiva no puede asignarse a nuevos productos.
- **RN-03:** Las categorías no se eliminan físicamente (borrado lógico).
- **RN-04:** Un producto solo puede pertenecer a categorías activas.
- **RN-05:** La descripción es opcional.

---

## 📤 Postcondiciones

- Una categoría creada queda disponible para asignarse a productos.
- Una categoría actualizada refleja cambios en tiempo real.
- Una categoría inactivada deja de estar disponible para nuevos productos.
- Los productos asociados mantienen su integridad referencial.
