"""
# Guía de Desarrollo - Inventory Manager

## 📋 Tabla de Contenidos

1. [Setup Local](#setup-local)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Ejecución](#ejecución)
4. [Tests](#tests)
5. [API Documentation](#api-documentation)
6. [Mejores Prácticas](#mejores-prácticas)

---

## 🚀 Setup Local

### Requisitos Previos

- Python 3.11+
- pip o poetry
- Git

### Instalación

1. **Clonar repositorio**
   ```bash
   git clone <repository>
   cd ERP-inventario
   ```

2. **Crear entorno virtual**
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env si es necesario (default SQLite es OK para desarrollo)
   ```

5. **Ejecutar aplicación**
   ```bash
   python -m uvicorn main:app --reload
   ```

   La API estará disponible en: http://localhost:8000

---

## 📁 Estructura del Proyecto

```
ERP-inventario/
├── src/
│   ├── __init__.py
│   ├── config.py              # Configuración de la aplicación
│   ├── db.py                  # Inicialización de BD y sesiones
│   ├── models.py              # Modelos SQLAlchemy
│   ├── schemas.py             # Schemas Pydantic (validación)
│   ├── exceptions/            # Excepciones personalizadas
│   │   ├── __init__.py
│   │   └── custom_exceptions.py
│   ├── services/              # Lógica de negocio
│   │   ├── __init__.py
│   │   ├── categoria_service.py
│   │   ├── producto_service.py
│   │   └── movimiento_service.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── routers/           # Endpoints API
│   │       ├── __init__.py
│   │       ├── categorias.py
│   │       ├── productos.py
│   │       └── movimientos.py
│   └── utils/                 # Utilidades
│       ├── __init__.py
│       └── init_data.py       # Script de datos de prueba
├── tests/                     # Tests unitarios
│   ├── __init__.py
│   ├── conftest.py           # Fixtures pytest
│   ├── test_categoria_service.py
│   ├── test_producto_service.py
│   └── test_movimiento_service.py
├── main.py                    # Aplicación FastAPI
├── requirements.txt           # Dependencias
├── Dockerfile                 # Containerización
├── docker-compose.yml         # Orquestación
├── .env.example              # Variables de entorno
└── README.md                 # Documentación del proyecto
```

### Descripción de Capas

**src/models.py**
- Modelos SQLAlchemy (ORM)
- Tablas: Category, Producto, MovimientoInventario, ConfiguracionSistema
- Relaciones y validaciones a nivel de BD

**src/schemas.py**
- Schemas Pydantic para request/response
- Validación de datos de entrada
- Serialización de respuestas

**src/services/**
- Capa de lógica de negocio
- Implementa reglas de negocio (RN-*)
- Maneja transacciones
- Lanza excepciones personalizadas

**src/api/routers/**
- Endpoints REST
- Maneja errores (convierte excepciones a HTTP)
- Documenta con docstrings

---

## ▶️ Ejecución

### Desarrollo Local (con reload)
```bash
python -m uvicorn main:app --reload
```

### Desarrollo Local (sin reload)
```bash
python -m uvicorn main:app
```

### Con Docker
```bash
docker-compose up -d

# Logs en tiempo real
docker-compose logs -f api
```

### Detener Docker
```bash
docker-compose down
```

---

## 🧪 Tests

### Ejecutar todos los tests
```bash
pytest
```

### Tests con cobertura
```bash
pytest --cov=src
```

### Tests de un módulo específico
```bash
pytest tests/test_categoria_service.py -v
```

### Tests en modo watch
```bash
pytest -v --tb=short
```

### Estructura de Tests
- `tests/conftest.py`: Fixtures compartidas (DB test, client, datos de prueba)
- `tests/test_*_service.py`: Tests unitarios de servicios
- `tests/test_*_api.py`: Tests de integración de endpoints (por implementar)

---

## 📖 API Documentation

### Swagger UI
```
GET http://localhost:8000/docs
```

### ReDoc
```
GET http://localhost:8000/redoc
```

### OpenAPI JSON
```
GET http://localhost:8000/openapi.json
```

### Endpoints Principales

#### Categorías
```
POST   /api/categorias              # Crear
GET    /api/categorias              # Listar
GET    /api/categorias/{id}         # Obtener
PUT    /api/categorias/{id}         # Actualizar
DELETE /api/categorias/{id}         # Desactivar
```

#### Productos
```
POST   /api/productos               # Crear
GET    /api/productos               # Listar
GET    /api/productos/{id}          # Obtener
PUT    /api/productos/{id}          # Actualizar
DELETE /api/productos/{id}          # Desactivar
GET    /api/productos/alertas/stock-bajo  # Stock bajo
```

#### Movimientos
```
POST   /api/movimientos/entradas    # Registrar entrada
POST   /api/movimientos/salidas     # Registrar salida
GET    /api/movimientos/historial/{product_id}  # Historial con filtros
GET    /api/movimientos/{id}        # Obtener movimiento
```

---

## ✅ Mejores Prácticas Implementadas

### 1. **Arquitectura en Capas**
   - Models (BD)
   - Schemas (Validación)
   - Services (Lógica)
   - Routers (API)

### 2. **Manejo de Errores**
   - Excepciones personalizadas (`src/exceptions/`)
   - HTTP exception handlers
   - Códigos HTTP estándar (200, 201, 400, 404, 409, 500)

### 3. **Validación**
   - Pydantic schemas en todos los endpoints
   - Validaciones a nivel de negocio en services
   - Validaciones de BD (unique constraints, FK)

### 4. **Documentación**
   - Docstrings en todas las funciones
   - Tipos explícitos (type hints)
   - Comentarios en lógica compleja
   - Swagger/ReDoc automático

### 5. **Testing**
   - Fixtures pytest reutilizables
   - Tests unitarios de servicios
   - In-memory SQLite para tests
   - Aislar BD de prueba del desarrollo

### 6. **Seguridad**
   - Soft delete (nunca eliminar datos)
   - Validación de integridad referencial
   - CORS configurado
   - Usuario no-root en Docker

### 7. **Performance**
   - Índices en campos frecuentes (SKU, fecha)
   - Lazy loading en relaciones
   - Transacciones explícitas
   - Connection pooling

### 8. **Code Quality**
   - Nombres descriptivos
   - Funciones pequeñas y enfocadas
   - No repetición (DRY)
   - Constantes en enums

---

## 📝 Convenciones de Código

### Nombres
- **Clases**: PascalCase (Category, Producto)
- **Funciones**: snake_case (crear_categoria, obtener_producto)
- **Constantes**: UPPER_SNAKE_CASE (MAX_QUANTITY)

### Imports
Orden: stdlib → third-party → local
```python
from datetime import datetime
from sqlalchemy.orm import Session
from src.models import Category
```

### Docstrings
```python
def crear_categoria(db: Session, categoria: CategoriaCreate) -> Category:
    """
    Crear una nueva categoría.
    
    Args:
        db: Database session.
        categoria: Category data.
        
    Returns:
        Created Category object.
        
    Raises:
        DuplicateResourceError: Si nombre ya existe.
    """
```

---

## 🔧 Troubleshooting

### Base de datos corrupta
```bash
rm inventory.db
python -m uvicorn main:app --reload
```

### Errores de importación
```bash
# Asegurarse que está en el directorio raíz
pwd  # Debe mostrar: /ruta/al/ERP-inventario
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### Tests fallando
```bash
# Limpiar cache de pytest
rm -rf .pytest_cache __pycache__
pytest -v
```

---

## 📚 Referencias

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Pydantic Validation](https://docs.pydantic.dev/)
- [Pytest Documentation](https://docs.pytest.org/)

---

## 🤝 Contribuir

1. Crear rama feature: `git checkout -b feature/nombre`
2. Hacer cambios
3. Tests: `pytest`
4. Commit: `git commit -am "Descripción"`
5. Push: `git push origin feature/nombre`
6. Pull Request

---

**Versión**: 1.0.0  
**Última actualización**: 2024
"""
