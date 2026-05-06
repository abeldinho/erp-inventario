# UC-07 — Persistencia de Datos

## 1. Nombre
Persistencia y gestión de datos del sistema

## 2. Actor principal
Sistema de Base de Datos

## 3. Actores secundarios
- Backend (FastAPI)
- ORM (SQLAlchemy)
- Mecanismo de Migración (opcional: Alembic)
- Administrador del sistema (en fase de mantenimiento)

---

## 4. Descripción
Este caso de uso define cómo el sistema almacena, actualiza y garantiza la integridad de todos los datos relacionados con productos, categorías y movimientos de inventario.

La persistencia debe:
- Operar por defecto en **SQLite** para desarrollo local.
- Permitir migrar a **PostgreSQL** sin modificar la lógica de negocio.
- Mantener consistentemente relaciones entre entidades.
- Registrar todos los movimientos sin eliminar historial.
- Garantizar que los datos estén disponibles en todo momento para la API.

Este caso de uso asegura la base técnica para el funcionamiento estable del inventario.

---

## 5. Flujo principal — Operación normal de persistencia

1. El backend recibe una solicitud que implica lectura o escritura de datos.
2. El ORM (SQLAlchemy) construye consultas basadas en:
   - Modelos definidos
   - Relaciones (FK)
   - Validaciones
3. El sistema se conecta al motor de base de datos configurado:
   - SQLite en desarrollo
   - PostgreSQL en despliegue
4. El motor procesa la operación:
   - Insertar producto/categoría/movimiento
   - Actualizar un registro
   - Consultar datos o historial
   - Marcar como inactivo (soft delete)
5. El motor ejecuta validaciones de integridad:
   - Claves foráneas
   - Unicidad de SKU y nombre de categoría
   - Relación producto–movimiento
6. Si la operación es exitosa:
   - El ORM confirma la transacción (`commit`)
7. Los datos quedan guardados o consultados correctamente.
8. El sistema devuelve respuesta al backend.
9. El caso de uso finaliza con éxito.

---

## 6. Flujos alternativos

### A1 — Error de conexión
- 3.a No se puede conectar al motor.
- 3.b Devuelve error al backend.
- 3.c Backend responde:  
  - HTTP **500 Internal Server Error**  
  - Mensaje: “Error de conexión con la base de datos.”

---

### A2 — Violación de unicidad
- 5.a Se intenta registrar un SKU o nombre de categoría duplicado.
- 5.b El motor rechaza la operación.
- 5.c Backend responde:  
  - HTTP **409 Conflict**

---

### A3 — Error por integridad referencial
Ejemplo: eliminar categoría con productos activos.

- 5.d La operación rompe relaciones.
- 5.e El motor detiene la acción.
- 5.f Backend devuelve:  
  - HTTP **400 Bad Request**

---

### A4 — Error en escritura (commit)
- 6.a La transacción falla.
- 6.b Motor revierte la operación (`rollback`).
- 6.c Backend devuelve:  
  - HTTP **500 Internal Server Error**

---

### A5 — Formato de datos inválido
- 2.a El ORM detecta datos incompatibles con el modelo.
- 2.b Backend devuelve:  
  - HTTP **400 Bad Request**

---

## 7. Precondiciones
- Los modelos ORM deben estar definidos correctamente.
- El archivo de configuración debe especificar el motor de base de datos.
- La base de datos debe estar accesible.
- Las tablas deben existir (migradas o creadas automáticamente).

---

## 8. Postcondiciones
- Los datos quedan almacenados de forma permanente.
- La integridad referencial se mantiene.
- El historial de movimientos se conserva intacto.
- No se eliminan datos críticos, solo se marcan como inactivos.

---

## 9. Reglas de negocio asociadas

- **RN-28:** La eliminación física está prohibida; solo se permite borrado lógico.
- **RN-29:** El SKU de producto debe ser único.
- **RN-30:** El nombre de la categoría debe ser único.
- **RN-31:** Cada movimiento debe pertenecer a un producto existente.
- **RN-32:** El stock nunca puede ser negativo.
- **RN-33:** Las transacciones deben manejarse con commit y rollback.
- **RN-34:** La migración de SQLite → PostgreSQL debe requerir solo cambio de configuración.

---

## 10. Modelos principales involucrados

### Producto
- id  
- nombre  
- descripción  
- sku  
- categoría_id  
- precio  
- stock_actual  
- stock_minimo  
- activo (boolean)

### Categoría
- id  
- nombre  
- descripción  
- activo

### Movimiento
- id  
- producto_id  
- tipo (entrada/salida)  
- cantidad  
- motivo  
- fecha_hora  
- usuario  
- stock_resultante

---

## 11. Frecuencia de uso
Muy alta (cada operación del sistema interactúa con la base de datos).

## 12. Prioridad
Crítica.