"""API routers and endpoints for Inventory Manager."""

from .routers import categoria_router, producto_router, movimiento_router

__all__ = [
    "categoria_router",
    "producto_router",
    "movimiento_router",
]
