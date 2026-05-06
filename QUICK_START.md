# ⚡ Quick Start - Inventory Manager

Guía rápida para empezar en 5 minutos.

---

## 🚀 Opción 1: Script Automático (Recomendado)

### Linux / Mac
```bash
chmod +x run.sh
./run.sh
```

### Windows
```bash
run.bat
```

**Listo en 30 segundos.** La aplicación se inicia automáticamente en http://localhost:8000

---

## 🐳 Opción 2: Docker (Más fácil)

```bash
docker-compose up -d
```

Accede a: http://localhost:8000

Para ver logs:
```bash
docker-compose logs -f api
```

Para detener:
```bash
docker-compose down
```

---

## 🛠️ Opción 3: Manual

```bash
# 1. Crear entorno virtual
python3 -m venv venv

# 2. Activar
source venv/bin/activate           # Mac/Linux
# o
venv\Scripts\activate              # Windows

# 3. Instalar
pip install -r requirements.txt

# 4. Ejecutar
python3 -m uvicorn main:app --reload
```

Accede a: http://localhost:8000

---

## 📍 Acceso a la API

| Recurso | URL |
|---------|-----|
| API | http://localhost:8000 |
| Docs (Swagger) | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| Health Check | http://localhost:8000/health |
| OpenAPI JSON | http://localhost:8000/openapi.json |

---

## 🧪 Probar Endpoints

### Usando Swagger UI (Interfaz Gráfica)
1. Ir a http://localhost:8000/docs
2. Hacer clic en "Try it out" en cada endpoint
3. Llenar parámetros
4. Ejecutar

### Usando curl (Terminal)

**Crear categoría:**
```bash
curl -X POST http://localhost:8000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Electrónica"}'
```

**Listar categorías:**
```bash
curl http://localhost:8000/api/categorias
```

**Crear producto:**
```bash
curl -X POST http://localhost:8000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Laptop",
    "sku":"LAP-001",
    "categoria_id":1,
    "precio":1000,
    "stock_inicial":10,
    "stock_minimo":2
  }'
```

**Registrar entrada:**
```bash
curl -X POST http://localhost:8000/api/movimientos/entradas \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id":1,
    "cantidad":5,
    "motivo":"Compra",
    "usuario":"juan"
  }'
```

Ver más ejemplos en `API_EXAMPLES.md`

---

## 🧪 Ejecutar Tests

```bash
# Instalar pytest primero
pip install pytest pytest-asyncio httpx

# Ejecutar todos los tests
pytest

# Con output detallado
pytest -v

# Solo un archivo
pytest tests/test_categoria_service.py -v
```

---

## 📚 Documentación Rápida

| Documento | Descripción |
|-----------|-------------|
| `README.md` | Visión general |
| `DEVELOPMENT.md` | Desarrollo local |
| `API_EXAMPLES.md` | Ejemplos curl |
| `docs/BUSINESS_RULES.md` | Reglas de negocio |
| `docs/ARCHITECTURE.md` | Arquitectura técnica |
| `/docs` (web) | Swagger UI (interactivo) |

---

## 🔧 Comandos Útiles (si tienes Make instalado)

```bash
make help          # Ver todos los comandos
make dev           # Ejecutar en desarrollo
make test          # Ejecutar tests
make test-cov      # Tests con cobertura
make clean         # Limpiar archivos temporales
make db-clean      # Borrar base de datos
make docker-up     # Iniciar Docker
make docker-down   # Detener Docker
```

---

## 📊 Datos de Ejemplo

Cuando inicies la aplicación por primera vez, se crean automáticamente:

**4 Categorías:**
- Electrónica
- Ropa
- Alimentos
- Oficina

**8 Productos** con stock y precios

Perfecto para probar inmediatamente.

---

## ❓ Preguntas Frecuentes

### ¿Dónde está la base de datos?
`inventory.db` en la raíz del proyecto (SQLite)

### ¿Puedo usar PostgreSQL?
Sí, configura `DATABASE_URL` en `.env`:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/inventory
```

### ¿Cómo limpio la base de datos?
```bash
rm inventory.db
# O con Make:
make db-clean
```

### ¿Dónde están los logs?
En la consola donde ejecutaste el servidor. Para Docker:
```bash
docker-compose logs -f api
```

### ¿Necesito crear las tablas?
No, se crean automáticamente al iniciar.

### ¿Puedo desactivar los datos de ejemplo?
Sí, comenta `init_sample_data()` en `main.py`

---

## 🎯 Próximos Pasos

1. ✅ Servidor corriendo → http://localhost:8000/docs
2. 📖 Revisar `API_EXAMPLES.md` para más requests
3. 🧪 Ejecutar `pytest` para ver los tests
4. 📚 Leer `DEVELOPMENT.md` para desarrollo
5. 🏗️ Explorar estructura en `docs/ARCHITECTURE.md`

---

## 💻 Stack Rápido

- **Backend**: FastAPI (Python)
- **BD**: SQLite (desarrollo) / PostgreSQL (producción)
- **ORM**: SQLAlchemy
- **Validación**: Pydantic
- **Testing**: Pytest
- **Container**: Docker

---

## 🆘 Si algo no funciona

### "ModuleNotFoundError"
```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### "Port 8000 already in use"
```bash
# Cambiar puerto:
python3 -m uvicorn main:app --port 8001 --reload
```

### "Database is locked"
```bash
rm inventory.db
# Reiniciar
```

---

**🎉 ¡Listo! Ya tienes Inventory Manager corriendo.**

Cualquier duda, revisar documentación o contactar.

**Versión**: 1.0.0
