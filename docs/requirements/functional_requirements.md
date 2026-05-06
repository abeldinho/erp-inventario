# 📌 Requerimientos Funcionales (FR)

## 1. Gestión de Productos

**FR-01:** El sistema debe permitir crear un producto con los atributos: nombre, descripción, SKU único, categoría, precio unitario y stock inicial.  
**FR-02:** El sistema debe validar que el SKU sea único en la base de datos antes de permitir crear un producto.  
**FR-03:** El sistema debe permitir leer (consultar) todos los productos activos con sus atributos completos.  
**FR-04:** El sistema debe permitir actualizar los atributos de un producto existente (nombre, descripción, categoría, precio).  
**FR-05:** El sistema debe permitir marcar un producto como inactivo (borrado lógico), sin eliminar su historial.  
**FR-06:** El sistema debe mostrar el stock actual de cada producto basado en los movimientos registrados.

---

## 2. Gestión de Categorías

**FR-07:** El sistema debe permitir crear una categoría con nombre único y descripción opcional.  
**FR-08:** El sistema debe validar que el nombre de la categoría sea único antes de permitir su creación.  
**FR-09:** El sistema debe permitir leer (consultar) todas las categorías disponibles.  
**FR-10:** El sistema debe permitir actualizar el nombre y descripción de una categoría existente.  
**FR-11:** El sistema debe permitir marcar una categoría como inactiva sin eliminar sus productos asociados.

---

## 3. Movimientos de Inventario

**FR-12:** El sistema debe permitir registrar un movimiento de entrada (incremento de stock) con: producto, cantidad, motivo, fecha y usuario.  
**FR-13:** El sistema debe permitir registrar un movimiento de salida (decremento de stock) con: producto, cantidad, motivo, fecha y usuario.  
**FR-14:** El sistema debe validar que la cantidad en un movimiento sea mayor a cero antes de registrarlo.  
**FR-15:** El sistema debe validar que no haya salida de stock superior al disponible (no permitir negativos).  
**FR-16:** El sistema debe actualizar automáticamente el stock actual del producto al registrar un movimiento.  
**FR-17:** El sistema debe registrar la fecha y hora exacta de cada movimiento.

---

## 4. Historial y Consultas

**FR-18:** El sistema debe permitir consultar el historial completo de movimientos de un producto específico ordenado por fecha descendente.  
**FR-19:** El sistema debe permitir filtrar el historial por rango de fechas (desde - hasta).  
**FR-20:** El sistema debe permitir filtrar el historial por tipo de movimiento (entrada/salida).  
**FR-21:** El sistema debe mostrar en cada registro del historial: fecha, tipo, cantidad, motivo, stock resultante y usuario.

---

## 5. Alertas de Stock Bajo

**FR-22:** El sistema debe permitir definir un nivel mínimo de stock por producto.  
**FR-23:** El sistema debe indicar visualmente cuáles productos están por debajo del stock mínimo configurado.  
**FR-24:** El sistema debe proporcionar un listado de productos con stock bajo (filtrados por estado de alerta).

---

## 6. API REST

**FR-25:** El sistema debe exponer todos los CRUD de productos a través de una API REST siguiendo estándares OpenAPI 3.0.  
**FR-26:** El sistema debe exponer todos los CRUD de categorías a través de una API REST.  
**FR-27:** El sistema debe exponer endpoints para registrar movimientos de inventario.  
**FR-28:** El sistema debe exponer endpoints para consultar el historial de movimientos.  
**FR-29:** El sistema debe exponer un endpoint para obtener el listado de productos con stock bajo.  
**FR-30:** El sistema debe retornar códigos HTTP estándar (200, 201, 400, 404, 409, 500) en todas las respuestas.

---

## 7. Persistencia de Datos

**FR-31:** El sistema debe almacenar todos los datos en SQLite para desarrollo.  
**FR-32:** El sistema debe soportar migración a PostgreSQL sin cambios en la lógica de negocio.  
**FR-33:** El sistema debe mantener la integridad referencial entre productos, categorías y movimientos.

---

## 8. Funcionalidad General

**FR-34:** El sistema debe funcionar sin autenticación en esta versión (usuario único implícito).  
**FR-35:** El sistema debe inicializar con una base de datos limpia o con datos de ejemplo si es la primera ejecución.

---

# 🔄 Mapeo a Casos de Uso (UC)

| Caso de Uso | Requerimientos Asociados |
|-------------|---------------------------|
| **UC-01: Gestionar Productos** | FR-01 a FR-06 |
| **UC-02: Gestionar Categorías** | FR-07 a FR-11 |
| **UC-03: Registrar Movimiento de Inventario** | FR-12 a FR-17 |
| **UC-04: Consultar Historial** | FR-18 a FR-21 |
| **UC-05: Monitorear Stock Bajo** | FR-22 a FR-24 |
| **UC-06: Exponer API REST** | FR-25 a FR-30 |
| **UC-07: Persistencia de Datos** | FR-31 a FR-33 |
| **UC-08: Inicialización del Sistema** | FR-34 a FR-35 |

---