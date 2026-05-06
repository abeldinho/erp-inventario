"""API routers for all endpoints."""

from .categorias import router as categoria_router
from .productos import router as producto_router
from .movimientos import router as movimiento_router

__all__ = [
    "categoria_router",
    "producto_router",
    "movimiento_router",
]
