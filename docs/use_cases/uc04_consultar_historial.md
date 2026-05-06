# UC-04 — Consultar Historial de Movimientos

## 1. Nombre
Consultar historial de movimientos de inventario

## 2. Actor principal
Usuario Administrador del Sistema

## 3. Actores secundarios
- Sistema de Base de Datos
- Módulo de Filtrado y Ordenamiento

---

## 4. Descripción
Este caso de uso permite al usuario visualizar el historial completo de movimientos asociados a un producto, así como filtrarlos por **rango de fechas**, **tipo de movimiento** (entrada o salida) y otros atributos.

El objetivo es entregar trazabilidad total del inventario para auditorías, revisiones y control de stock.

---

## 5. Flujo principal — Consulta exitosa

1. El usuario accede al módulo “Historial de Movimientos”.
2. El sistema muestra las opciones de filtrado:
   - Producto
   - Rango de fechas (desde / hasta)
   - Tipo de movimiento (entrada / salida / todos)
3. El usuario selecciona un producto.
4. El usuario define los filtros deseados (opcional).
5. El usuario presiona el botón “Buscar”.
6. El sistema valida los filtros:
   - Formatos de fecha correctos
   - Fechas en orden lógico (desde ≤ hasta)
7. El sistema consulta la base de datos.
8. El sistema obtiene la lista de movimientos.
9. El sistema ordena los movimientos por fecha descendente.
10. El sistema muestra los resultados en una tabla con columnas:
    - Fecha y hora
    - Tipo de movimiento
    - Cantidad
    - Motivo
    - Stock resultante
    - Usuario responsable
11. El usuario puede seleccionar un movimiento para ver detalles ampliados.
12. El caso de uso finaliza con éxito.

---

## 6. Flujos alternativos

### A1 — Producto no seleccionado
- 3.a El usuario intenta continuar sin seleccionar un producto.
- 3.b El sistema muestra: **“Debe seleccionar un producto para consultar su historial.”**
- 3.c Retorna al paso 3.

---

### A2 — Rango de fechas inválido
- 6.a La fecha “desde” es mayor que la fecha “hasta”.
- 6.b El sistema muestra: **“El rango de fechas es inválido.”**
- 6.c Retorna al paso 4.

---

### A3 — Formato de fecha incorrecto
- 6.d La fecha contiene un formato no válido.
- 6.e El sistema muestra: **“Formato de fecha incorrecto.”**
- 6.f Retorna al paso 4.

---

### A4 — Sin resultados
- 8.a No existen movimientos que coincidan con los filtros.
- 8.b El sistema muestra: **“No se encontraron movimientos para los criterios seleccionados.”**
- 8.c Ofrece opción “Limpiar filtros”.
- 8.d Retorna al paso 2.

---

### A5 — Error en la base de datos
- 7.a Ocurre un error al consultar los datos.
- 7.b El sistema muestra: **“Error al obtener historial. Intente nuevamente.”**
- 7.c El caso de uso finaliza sin éxito.

---

## 7. Precondiciones
- El producto debe existir.
- El usuario debe tener acceso al módulo de historial.
- La base de datos debe estar operativa.

---

## 8. Postcondiciones
- Los movimientos consultados quedan visibles para el usuario.
- No se modifica ningún dato del sistema.
- Los filtros aplicados quedan registrados en la sesión (opcional).

---

## 9. Reglas de negocio asociadas
- **RN-15:** Toda consulta debe ser ordenada por fecha descendente.
- **RN-16:** No se permite consultar movimientos sin seleccionar un producto.
- **RN-17:** Los resultados deben incluir stock resultante para garantizar trazabilidad.

---

## 10. Frecuencia de uso
Media.

## 11. Prioridad
Alta.