# 📚 Ejemplos de Uso de la API

Guía práctica con ejemplos de requests para todos los endpoints.

## 📋 Tabla de Contenidos

1. [Health Check](#health-check)
2. [Categorías](#categorías)
3. [Productos](#productos)
4. [Movimientos](#movimientos)
5. [Consultas y Filtros](#consultas-y-filtros)

---

## ✅ Health Check

### Verificar estado de la aplicación

```bash
curl -X GET http://localhost:8000/health
```

**Respuesta (200)**
```json
{
  "status": "healthy",
  "app": "Inventory Manager",
  "version": "1.0.0"
}
```

---

## 🏷️ Categorías

### Crear categoría

```bash
curl -X POST http://localhost:8000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Electrónica",
    "descripcion": "Productos electrónicos diversos"
  }'
```

**Respuesta (201)**
```json
{
  "id": 1,
  "nombre": "Electrónica",
  "descripcion": "Productos electrónicos diversos",
  "activo": true,
  "created_at": "2024-01-20T10:30:00"
}
```

### Listar categorías

```bash
curl -X GET http://localhost:8000/api/categorias
```

**Respuesta (200)**
```json
[
  {
    "id": 1,
    "nombre": "Electrónica",
    "descripcion": "Productos electrónicos diversos",
    "activo": true,
    "created_at": "2024-01-20T10:30:00"
  },
  {
    "id": 2,
    "nombre": "Ropa",
    "descripcion": "Prendas de vestir",
    "activo": true,
    "created_at": "2024-01-20T10:31:00"
  }
]
```

### Obtener categoría por ID

```bash
curl -X GET http://localhost:8000/api/categorias/1
```

**Respuesta (200)**
```json
{
  "id": 1,
  "nombre": "Electrónica",
  "descripcion": "Productos electrónicos diversos",
  "activo": true,
  "created_at": "2024-01-20T10:30:00"
}
```

### Actualizar categoría

```bash
curl -X PUT http://localhost:8000/api/categorias/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Electrónica y Tecnología",
    "descripcion": "Productos tecnológicos actualizados"
  }'
```

**Respuesta (200)**
```json
{
  "id": 1,
  "nombre": "Electrónica y Tecnología",
  "descripcion": "Productos tecnológicos actualizados",
  "activo": true,
  "created_at": "2024-01-20T10:30:00"
}
```

### Desactivar categoría

```bash
curl -X DELETE http://localhost:8000/api/categorias/1
```

**Respuesta (200)**
```json
{
  "id": 1,
  "nombre": "Electrónica",
  "descripcion": "Productos electrónicos diversos",
  "activo": false,
  "created_at": "2024-01-20T10:30:00"
}
```

---

## 📦 Productos

### Crear producto

```bash
curl -X POST http://localhost:8000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop Dell XPS 15",
    "descripcion": "Laptop de alta gama para profesionales",
    "sku": "DELL-XPS15-2024",
    "categoria_id": 1,
    "precio": 1299.99,
    "stock_inicial": 10,
    "stock_minimo": 2
  }'
```

**Respuesta (201)**
```json
{
  "id": 1,
  "nombre": "Laptop Dell XPS 15",
  "descripcion": "Laptop de alta gama para profesionales",
  "sku": "DELL-XPS15-2024",
  "categoria_id": 1,
  "precio": 1299.99,
  "stock_actual": 10,
  "stock_minimo": 2,
  "activo": true,
  "created_at": "2024-01-20T11:00:00",
  "updated_at": "2024-01-20T11:00:00"
}
```

### Listar productos

```bash
curl -X GET http://localhost:8000/api/productos
```

**Respuesta (200)**
```json
[
  {
    "id": 1,
    "nombre": "Laptop Dell XPS 15",
    "descripcion": "Laptop de alta gama para profesionales",
    "sku": "DELL-XPS15-2024",
    "categoria_id": 1,
    "precio": 1299.99,
    "stock_actual": 10,
    "stock_minimo": 2,
    "activo": true,
    "created_at": "2024-01-20T11:00:00",
    "updated_at": "2024-01-20T11:00:00"
  }
]
```

### Obtener producto por ID

```bash
curl -X GET http://localhost:8000/api/productos/1
```

### Actualizar producto

```bash
curl -X PUT http://localhost:8000/api/productos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop Dell XPS 15 (Actualizado)",
    "precio": 1199.99,
    "stock_minimo": 3
  }'
```

### Desactivar producto

```bash
curl -X DELETE http://localhost:8000/api/productos/1
```

### Obtener productos con stock bajo

```bash
curl -X GET http://localhost:8000/api/productos/alertas/stock-bajo
```

**Respuesta (200)**
```json
[
  {
    "id": 1,
    "nombre": "Laptop Dell XPS 15",
    "sku": "DELL-XPS15-2024",
    "stock_actual": 1,
    "stock_minimo": 2,
    "categoria_id": 1,
    "diferencia": -1
  }
]
```

---

## 📥 Movimientos

### Registrar entrada de stock

```bash
curl -X POST http://localhost:8000/api/movimientos/entradas \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 1,
    "cantidad": 5,
    "motivo": "Compra a proveedor Tech Corp",
    "usuario": "juan.perez",
    "fecha_hora": "2024-01-20T14:00:00"
  }'
```

**Respuesta (201)**
```json
{
  "id": 1,
  "producto_id": 1,
  "tipo": "entrada",
  "cantidad": 5,
  "motivo": "Compra a proveedor Tech Corp",
  "fecha_hora": "2024-01-20T14:00:00",
  "usuario": "juan.perez",
  "stock_resultante": 15
}
```

### Registrar salida de stock

```bash
curl -X POST http://localhost:8000/api/movimientos/salidas \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 1,
    "cantidad": 2,
    "motivo": "Venta a cliente Cliente XYZ",
    "usuario": "maria.garcia",
    "fecha_hora": "2024-01-20T15:00:00"
  }'
```

**Respuesta (201)**
```json
{
  "id": 2,
  "producto_id": 1,
  "tipo": "salida",
  "cantidad": 2,
  "motivo": "Venta a cliente Cliente XYZ",
  "fecha_hora": "2024-01-20T15:00:00",
  "usuario": "maria.garcia",
  "stock_resultante": 13
}
```

### Obtener movimiento específico

```bash
curl -X GET http://localhost:8000/api/movimientos/1
```

---

## 🔍 Consultas y Filtros

### Historial sin filtros

```bash
curl -X GET http://localhost:8000/api/movimientos/historial/1
```

**Respuesta (200)**
```json
{
  "total": 2,
  "movimientos": [
    {
      "id": 2,
      "producto_id": 1,
      "tipo": "salida",
      "cantidad": 2,
      "motivo": "Venta a cliente Cliente XYZ",
      "fecha_hora": "2024-01-20T15:00:00",
      "usuario": "maria.garcia",
      "stock_resultante": 13
    },
    {
      "id": 1,
      "producto_id": 1,
      "tipo": "entrada",
      "cantidad": 5,
      "motivo": "Compra a proveedor Tech Corp",
      "fecha_hora": "2024-01-20T14:00:00",
      "usuario": "juan.perez",
      "stock_resultante": 15
    }
  ]
}
```

### Historial filtrado por fecha (desde-hasta)

```bash
curl -X GET "http://localhost:8000/api/movimientos/historial/1?desde=2024-01-20T10:00:00&hasta=2024-01-20T16:00:00"
```

### Historial filtrado por tipo (entrada)

```bash
curl -X GET "http://localhost:8000/api/movimientos/historial/1?tipo=entrada"
```

### Historial filtrado por tipo (salida)

```bash
curl -X GET "http://localhost:8000/api/movimientos/historial/1?tipo=salida"
```

### Historial con múltiples filtros

```bash
curl -X GET "http://localhost:8000/api/movimientos/historial/1?desde=2024-01-20T10:00:00&hasta=2024-01-20T16:00:00&tipo=entrada"
```

---

## ❌ Errores Comunes

### 409 - Conflicto (SKU duplicado)

```bash
curl -X POST http://localhost:8000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto 2",
    "sku": "DELL-XPS15-2024",  # Ya existe
    "categoria_id": 1,
    "precio": 100,
    "stock_inicial": 5
  }'
```

**Respuesta (409)**
```json
{
  "detail": "SKU 'DELL-XPS15-2024' ya existe en el sistema"
}
```

### 400 - Bad Request (Stock insuficiente)

```bash
curl -X POST http://localhost:8000/api/movimientos/salidas \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 1,
    "cantidad": 1000,  # Más del disponible
    "motivo": "Venta"
  }'
```

**Respuesta (400)**
```json
{
  "detail": "Stock insuficiente para 'Laptop Dell XPS 15'. Disponible: 10, Solicitado: 1000"
}
```

### 404 - Not Found

```bash
curl -X GET http://localhost:8000/api/productos/9999
```

**Respuesta (404)**
```json
{
  "detail": "Producto con ID 9999 no encontrado"
}
```

### 422 - Unprocessable Entity (Validación Pydantic)

```bash
curl -X POST http://localhost:8000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    # Falta sku (requerido)
    "categoria_id": 1,
    "precio": -100  # Negativo (inválido)
  }'
```

**Respuesta (422)**
```json
{
  "detail": "Validation error",
  "errors": [
    {
      "field": "sku",
      "message": "Field required"
    },
    {
      "field": "precio",
      "message": "ensure this value is greater than or equal to 0"
    }
  ]
}
```

---

## 💡 Tips

1. **Usar jq para formatear JSON** en bash:
   ```bash
   curl -s http://localhost:8000/api/productos | jq '.'
   ```

2. **Guardar respuestas en archivo**:
   ```bash
   curl -s http://localhost:8000/api/productos > productos.json
   ```

3. **Ver headers de respuesta**:
   ```bash
   curl -i http://localhost:8000/api/productos
   ```

4. **Usar Postman o Insomnia** para interfaz gráfica

5. **Swagger UI automático**: http://localhost:8000/docs

---

**Versión API**: 1.0.0
