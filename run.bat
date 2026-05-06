@echo off
REM Inventory Manager - Script de inicio rápido para Windows

echo 🚀 Iniciando Inventory Manager...
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creando entorno virtual...
    python -m venv venv
    echo ✓ Entorno virtual creado
)

REM Activate virtual environment
echo 🔌 Activando entorno virtual...
call venv\Scripts\activate.bat

REM Install/update dependencies
echo 📚 Instalando dependencias...
pip install -q -r requirements.txt
echo ✓ Dependencias instaladas

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✨ Inventory Manager API
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📍 API: http://localhost:8000
echo 📖 Docs: http://localhost:8000/docs
echo 📚 ReDoc: http://localhost:8000/redoc
echo 💚 Health: http://localhost:8000/health
echo.
echo Presiona CTRL+C para detener
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Run the application
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause
