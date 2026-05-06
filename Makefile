.PHONY: help install dev test test-cov test-watch lint clean docker-build docker-up docker-down

help:
	@echo "📚 Inventory Manager - Comandos disponibles"
	@echo ""
	@echo "Desarrollo (Backend):"
	@echo "  make install       - Instalar dependencias del backend"
	@echo "  make dev           - Ejecutar backend en modo desarrollo"
	@echo "  make lint          - Verificar código (flake8)"
	@echo "  make format        - Formatear código (black)"
	@echo ""
	@echo "Desarrollo (Frontend):"
	@echo "  make fe-install    - Instalar dependencias del frontend"
	@echo "  make fe-dev        - Ejecutar frontend en modo desarrollo"
	@echo ""
	@echo "Testing:"
	@echo "  make test          - Ejecutar tests del backend"
	@echo "  make test-cov      - Tests con cobertura"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build  - Construir imágenes"
	@echo "  make docker-up     - Iniciar todos los servicios"
	@echo "  make docker-down   - Detener todos los servicios"
	@echo ""
	@echo "Utilidades:"
	@echo "  make clean         - Limpiar archivos temporales"
	@echo "  make db-clean      - Eliminar base de datos (¡cuidado!)"
	@echo ""

# Backend
install:
	@echo "📦 Instalando dependencias del backend..."
	cd backend && pip install -r requirements.txt
	@echo "✓ Dependencias instaladas"

dev:
	@echo "🚀 Ejecutando backend en modo desarrollo..."
	cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

test:
	@echo "🧪 Ejecutando tests..."
	cd backend && pytest -v

test-cov:
	@echo "🧪 Ejecutando tests con cobertura..."
	cd backend && pytest --cov=src --cov-report=html
	@echo "✓ Reporte en: htmlcov/index.html"

lint:
	@echo "🔍 Verificando código..."
	cd backend && flake8 src tests --max-line-length=100
	@echo "✓ Verificación completada"

format:
	@echo "📝 Formateando código..."
	cd backend && black src tests
	@echo "✓ Código formateado"

# Frontend
fe-install:
	@echo "📦 Instalando dependencias del frontend..."
	cd frontend && npm install
	@echo "✓ Dependencias instaladas"

fe-dev:
	@echo "🚀 Ejecutando frontend en modo desarrollo..."
	cd frontend && npm run dev

fe-build:
	@echo "📦 Construyendo frontend para producción..."
	cd frontend && npm run build
	@echo "✓ Build completado"

# Docker
docker-build:
	@echo "🐳 Construyendo imágenes Docker..."
	docker-compose build
	@echo "✓ Imágenes construidas"

docker-up:
	@echo "🚀 Iniciando servicios Docker..."
	docker-compose up -d
	@echo "✓ Servicios iniciados"
	@echo "📍 Backend: http://localhost:8000"
	@echo "📍 Frontend: http://localhost:5173"

docker-down:
	@echo "🛑 Deteniendo servicios Docker..."
	docker-compose down
	@echo "✓ Servicios detenidos"

# Utilities
clean:
	@echo "🧹 Limpiando archivos temporales..."
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".coverage" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	cd frontend && rm -rf node_modules/.vite 2>/dev/null || true
	@echo "✓ Limpieza completada"

db-clean:
	@echo "⚠️  Eliminando base de datos..."
	rm -f backend/inventory.db
	@echo "✓ Base de datos eliminada"

.DEFAULT_GOAL := help