# UC-05 — Monitorear Stock Bajo

## 1. Nombre
Monitorear productos con stock bajo

## 2. Actor principal
Usuario Administrador del Sistema

## 3. Actores secundarios
- Sistema de Base de Datos
- Módulo de Cálculo de Stock y Alertas

---

## 4. Descripción
Este caso de uso permite al usuario visualizar todos los productos cuyo stock actual se encuentra por debajo del **nivel mínimo de stock configurado**.  
Su objetivo es facilitar la planificación de reposiciones y evitar quiebres de inventario.

Incluye la gestión del umbral mínimo por producto y las alertas visuales correspondientes.

---

## 5. Flujo principal — Consulta exitosa

1. El usuario accede al módulo “Stock Bajo”.
2. El sistema consulta en la base de datos todos los productos activos.
3. El sistema calcula para cada producto:
   - Stock actual
   - Stock mínimo configurado
   - Estado del producto (normal / alerta)
4. El sistema selecciona únicamente los productos cuyo stock actual < stock mínimo.
5. El sistema muestra la lista filtrada en una tabla con las columnas:
   - Nombre del producto
   - Stock actual
   - Stock mínimo
   - Categoría
   - Estado visual (icono de alerta o color destacado)
6. El usuario puede ordenar por:
   - Mayor urgencia (stock más bajo)
   - Categoría
   - Nombre del producto
7. El usuario puede seleccionar un producto para ver su historial reciente.
8. El usuario puede editar el nivel mínimo de stock directamente desde la pantalla.
9. El sistema actualiza el valor mínimo en la base de datos.
10. El caso de uso finaliza con éxito.

---

## 6. Flujos alternativos

### A1 — No existen productos con stock bajo
- 4.a El sistema detecta que todos los productos están dentro del rango normal.
- 4.b Muestra: **“No hay productos con stock bajo.”**
- 4.c Ofrece un botón para ver todos los productos igualmente.
- 4.d Retorna al paso 1 o finaliza.

---

### A2 — Nivel mínimo no configurado
- 3.a El sistema detecta que un producto no tiene nivel mínimo definido.
- 3.b Muestra indicador: **“Mínimo no configurado.”**
- 3.c Permite al usuario definirlo en ese momento.
- 3.d Luego continúa con el paso 3.

---

### A3 — Error al actualizar stock mínimo
- 9.a Ocurre un error al guardar el nuevo mínimo.
- 9.b Muestra: **“No fue posible guardar el stock mínimo. Intente nuevamente.”**
- 9.c Retorna al paso 8.

---

### A4 — Error en la base de datos
- 2.a El sistema no puede consultar los datos.
- 2.b Muestra: **“Error al obtener información de stock. Intente más tarde.”**
- 2.c El caso de uso termina sin éxito.

---

## 7. Precondiciones
- Los productos deben existir en el sistema.
- El usuario debe tener acceso al módulo de alertas.
- La base de datos debe estar disponible.

---

## 8. Postcondiciones
- Se muestra al usuario una lista actualizada de productos con stock bajo.
- Si corresponde, el stock mínimo queda actualizado.
- No se afecta el stock actual ni el historial.

---

## 9. Reglas de negocio asociadas
- **RN-18:** Todo producto debe tener un valor mínimo de stock para activar alertas.
- **RN-19:** No mostrar productos inactivos en alertas.
- **RN-20:** El color o icono de alerta debe ser estandarizado.
- **RN-21:** Todo ajuste de mínimo debe registrar fecha y usuario.
- **RN-22:** El cálculo de alerta es: `stock_actual < stock_minimo`.

---

## 10. Frecuencia de uso
Media-Alta (dependiendo de la operación del negocio).

## 11. Prioridad
Alta.