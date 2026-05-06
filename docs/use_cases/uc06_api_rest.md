# UC-06 — Exponer API REST

## 1. Nombre
Exponer API REST para acceso externo a funcionalidades del sistema

## 2. Actor principal
Cliente externo (frontend, herramientas externas, integraciones)

## 3. Actores secundarios
- Servidor Backend (FastAPI)
- Sistema de Base de Datos
- Generador de Documentación OpenAPI/Swagger

---

## 4. Descripción
Este caso de uso define cómo el sistema expone sus funcionalidades principales mediante una **API REST** estándar, permitiendo que aplicaciones externas interactúen con el inventario.

La API debe cumplir con:
- JSON como formato de intercambio.
- Documentación automática OpenAPI 3.0.
- Respuestas con códigos HTTP estándar.
- Estructura clara de endpoints con rutas RESTful.

Este caso de uso abarca CRUD de productos y categorías, registro de movimientos, historial y alertas de stock bajo.

---

## 5. Flujo principal — Consumo exitoso de la API

1. Un cliente externo envía una solicitud HTTP a un endpoint de la API.
2. El sistema recibe la solicitud y valida:
   - Método HTTP (GET, POST, PUT, DELETE)
   - Parámetros de consulta, path o body
   - Integridad de datos (schemas Pydantic)
3. El sistema ejecuta la operación correspondiente:
   - Crear/leer/actualizar productos
   - Crear/leer/actualizar categorías
   - Registrar movimientos
   - Consultar historial
   - Obtener productos con stock bajo
4. El backend interactúa con la base de datos según corresponda.
5. El sistema genera una respuesta JSON con:
   - Datos solicitados o mensaje de confirmación
   - Código HTTP correcto
6. El sistema registra logs básicos (opcional).
7. La respuesta es enviada al cliente.
8. El caso de uso finaliza con éxito.

---

## 6. Flujos alternativos

### A1 — Solicitud a un endpoint inexistente
- 1.a El cliente envía una ruta que no está definida.
- 1.b El sistema devuelve:
  - HTTP **404 Not Found**
  - Mensaje: “Endpoint no encontrado.”

---

### A2 — Error de validación de datos
- 2.a El sistema detecta datos faltantes o inválidos.
- 2.b Devuelve:
  - HTTP **400 Bad Request**
  - JSON con detalle de errores Pydantic.

---

### A3 — Conflicto por SKU o categoría duplicada
- 2.c El sistema detecta unicidad violada.
- 2.d Devuelve:
  - HTTP **409 Conflict**
  - Mensaje indicando el recurso duplicado.

---

### A4 — Solicitud para producto o categoría no encontrado
- 3.a El cliente solicita un ID inexistente.
- 3.b Devuelve:
  - HTTP **404 Not Found**
  - Mensaje correspondiente.

---

### A5 — Error interno del servidor
- 5.a Ocurre un problema inesperado.
- 5.b Devuelve:
  - HTTP **500 Internal Server Error**
  - Mensaje genérico.

---

## 7. Precondiciones
- La API debe estar desplegada y accesible.
- La base de datos debe estar operativa.
- Los modelos Pydantic deben estar definidos.
- Las rutas deben estar documentadas por OpenAPI.

---

## 8. Postcondiciones
- Los datos solicitados son devueltos o actualizados.
- Se mantiene un log de actividad (si se implementa).
- La API queda disponible para nuevas solicitudes.

---

## 9. Endpoints incluidos en este caso de uso

### Productos (`/api/products`)
- `GET /` — Listar productos  
- `GET /{id}` — Obtener un producto  
- `POST /` — Crear producto  
- `PUT /{id}` — Actualizar producto  
- `DELETE /{id}` — Desactivar producto  

### Categorías (`/api/categories`)
- `GET /`  
- `GET /{id}`  
- `POST /`  
- `PUT /{id}`  
- `DELETE /{id}`  

### Movimientos (`/api/movements`)
- `POST /entries` — Registrar entrada  
- `POST /exits` — Registrar salida  
- `GET /history/{product_id}` — Historial de un producto  

### Stock bajo (`/api/alerts`)
- `GET /low-stock` — Lista de productos con alerta  

---

## 10. Reglas de negocio asociadas

- **RN-23:** La API debe usar exclusivamente JSON.
- **RN-24:** Toda entidad debe cumplir validaciones Pydantic.
- **RN-25:** Todas las rutas deben aparecer en la documentación OpenAPI.
- **RN-26:** Los métodos HTTP deben respetar semántica REST (GET = leer, POST = crear, etc.).
- **RN-27:** La API no debe exponer datos de productos inactivos salvo en endpoints específicos.

---

## 11. Frecuencia de uso
Muy alta (la API es el medio primordial de consumo externo).

## 12. Prioridad
Crítica para el funcionamiento del ecosistema.