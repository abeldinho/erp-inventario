# UC-03 — Registrar Movimientos de Inventario

## 1. Nombre
Registrar movimientos de inventario (Entradas y Salidas)

## 2. Actor principal
Usuario Administrador del Sistema

## 3. Actores secundarios
- Sistema de Base de Datos
- Módulo de Cálculo de Stock

---

## 4. Descripción
Este caso de uso permite al usuario registrar cualquier cambio en el stock de un producto, ya sea por **entradas** (incrementos) o **salidas** (decrementos).  
Cada movimiento debe quedar registrado con su detalle completo, manteniendo trazabilidad absoluta y evitando inconsistencias como stock negativo.

Este caso de uso afecta directamente al valor actual de stock y al historial asociado al producto.

---

## 5. Flujo principal – Registro exitoso

1. El usuario accede al módulo “Inventario”.
2. El sistema muestra dos opciones: **Registrar Entrada** / **Registrar Salida**.
3. El usuario selecciona el tipo de movimiento.
4. El sistema muestra un formulario con los siguientes campos:
   - Producto (lista desplegable)
   - Cantidad
   - Motivo
   - Fecha (autocompletada con fecha actual, editable)
   - Usuario responsable (autocompletado)
5. El usuario selecciona un producto.
6. El usuario ingresa la cantidad del movimiento.
7. El sistema valida:
   - Que la cantidad sea > 0.
   - Para salidas: que el stock disponible sea suficiente.
8. El usuario ingresa el motivo del movimiento.
9. El sistema calcula el stock resultante.
10. El usuario confirma el registro.
11. El sistema guarda el movimiento en la base de datos.
12. El sistema actualiza el valor actual de stock del producto.
13. El sistema registra timestamp, usuario y tipo de movimiento.
14. El sistema muestra un mensaje de confirmación.
15. El caso de uso finaliza con éxito.

---

## 6. Flujos alternativos

### A1 — Cantidad inválida
- 7.a La cantidad ingresada es cero o negativa.
- 7.b El sistema muestra: **“La cantidad debe ser mayor a 0.”**
- 7.c Retorna al paso 6.

---

### A2 — Salida con stock insuficiente
- 7.d El sistema detecta que la salida excede el stock disponible.
- 7.e Muestra: **“No es posible registrar la salida: stock insuficiente.”**
- 7.f Retorna al paso 6.

---

### A3 — Producto inactivo
- 5.a El producto seleccionado está marcado como inactivo.
- 5.b El sistema alerta: **“Este producto está inactivo y no puede recibir movimientos.”**
- 5.c Retorna al paso 5.

---

### A4 — Error al guardar en la base de datos
- 11.a Ocurre un error al intentar guardar.
- 11.b El sistema muestra: **“Error al registrar movimiento. Intente nuevamente.”**
- 11.c El caso de uso finaliza sin éxito.

---

### A5 — Fecha no válida
- 4.a El usuario ingresa una fecha futura.
- 4.b El sistema muestra: **“La fecha del movimiento no puede ser futura.”**
- 4.c Retorna al paso 4.

---

## 7. Precondiciones
- El producto debe existir y estar activo.
- El usuario debe tener permisos para registrar movimientos.
- La base de datos debe estar disponible.
- Deben existir unidades suficientes para salidas.

---

## 8. Postcondiciones
- El nuevo movimiento queda registrado con trazabilidad completa.
- El stock del producto queda actualizado.
- El movimiento aparece en el historial del producto.
- Se registra timestamp y usuario.

---

## 9. Reglas de negocio asociadas
- **RN-10:** La cantidad debe ser > 0.
- **RN-11:** No se permite stock negativo.
- **RN-12:** Un producto inactivo no puede recibir movimientos.
- **RN-13:** Todo movimiento debe registrar fecha, usuario y motivo.
- **RN-14:** El stock resultante debe actualizarse inmediatamente.

---

## 10. Frecuencia de uso
Alta.

## 11. Prioridad
Crítica.