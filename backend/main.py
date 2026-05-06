"""
Inventory Manager - Main Application Entry Point.

FastAPI application for inventory management system.
Handles product, category and movement operations with full trazability.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from src.config import settings
from src.db import init_db, SessionLocal
from src.api import categoria_router, producto_router, movimiento_router
from src.exceptions import InventoryException
from src.utils import init_sample_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events handler.
    
    Startup: Initialize database tables.
    Shutdown: Cleanup (if needed).
    """
    # Startup
    init_db()
    db = SessionLocal()
    try:
        init_sample_data(db)
    finally:
        db.close()
    yield
    # Shutdown
    pass


# Create FastAPI application
app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version_str,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)


# ==================== MIDDLEWARE ====================

# CORS configuration (allows all origins for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== EXCEPTION HANDLERS ====================

@app.exception_handler(InventoryException)
async def inventory_exception_handler(request, exc: InventoryException):
    """Handle custom inventory exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    """Handle Pydantic validation errors."""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(x) for x in error["loc"][1:]),
            "message": error["msg"]
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Validation error",
            "errors": errors
        }
    )


# ==================== ROUTERS ====================

# Include routers
app.include_router(categoria_router)
app.include_router(producto_router)
app.include_router(movimiento_router)


# ==================== HEALTH CHECK ====================

@app.get(
    "/health",
    tags=["Health"],
    summary="Health check",
    description="Verifica el estado de la aplicación"
)
def health_check():
    """
    Health check endpoint.
    
    Returns basic application status and version.
    """
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.api_version_str
    }


# ==================== ROOT ====================

@app.get(
    "/",
    tags=["Root"],
    summary="API Info",
    description="Información general de la API"
)
def root():
    """
    Root endpoint - API information.
    
    Provides basic information about the API and links to documentation.
    """
    return {
        "message": f"Bienvenido a {settings.app_name}",
        "version": settings.api_version_str,
        "docs": "/docs",
        "redoc": "/redoc",
        "openapi": "/openapi.json"
    }


# ==================== APPLICATION INFO ====================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    )
