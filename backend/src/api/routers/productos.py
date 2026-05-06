"""

API endpoints for Product management.

Implements CRUD operations for products and low stock alerts following REST conventions.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.db import get_db
from src.schemas import (
    ProductoCreate,
    ProductoUpdate,
    ProductoResponse,
    ProductoAlertaStockBajo,
)
from src.services import ProductoService
from src.exceptions import (
    DuplicateResourceError,
    ResourceNotFoundError,
    InvalidOperationError,
)

router = APIRouter(prefix="/api/productos", tags=["Productos"])


@router.post(
    "",
    response_model=ProductoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear producto",
    description="Crea un nuevo producto en el inventario"
)
def crear_producto(
    producto: ProductoCreate,
    db: Session = Depends(get_db)
):
    """
    Crear un nuevo producto.
    
    - **nombre**: Nombre del producto (requerido)
    - **sku**: Identificador único del producto (requerido)
    - **categoria_id**: ID de la categoría (requerido)
    - **precio**: Precio unitario (>= 0)
    - **stock_inicial**: Stock inicial (>= 0)
    - **stock_minimo**: Nivel mínimo para alertas (>= 0)
    - **descripcion**: Descripción opcional
    """
    try:
        return ProductoService.crear_producto(db, producto)
    except (DuplicateResourceError, InvalidOperationError) as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


@router.get(
    "",
    response_model=list[ProductoResponse],
    summary="Listar productos",
    description="Obtiene lista de todos los productos activos ordenados por fecha de creación"
)
def listar_productos(db: Session = Depends(get_db)):
    """Obtener todos los productos activos."""
    return ProductoService.listar_productos(db)


@router.get(
    "/{producto_id}",
    response_model=ProductoResponse,
    summary="Obtener producto",
    description="Obtiene los detalles de un producto específico"
)
def obtener_producto(
    producto_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtener un producto por ID.
    
    - **producto_id**: ID del producto
    """
    try:
        return ProductoService.obtener_producto(db, producto_id)
    except ResourceNotFoundError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


@router.put(
    "/{producto_id}",
    response_model=ProductoResponse,
    summary="Actualizar producto",
    description="Actualiza los datos de un producto existente"
)
def actualizar_producto(
    producto_id: int,
    producto: ProductoUpdate,
    db: Session = Depends(get_db)
):
    """
    Actualizar un producto existente.
    
    - **producto_id**: ID del producto
    - **nombre**: Nuevo nombre (opcional)
    - **categoria_id**: Nueva categoría (opcional)
    - **precio**: Nuevo precio (opcional)
    - **stock_minimo**: Nuevo stock mínimo (opcional)
    - **descripcion**: Nueva descripción (opcional)
    
    Nota: No se puede modificar el stock directamente. Usar movimientos para ello.
    """
    try:
        return ProductoService.actualizar_producto(db, producto_id, producto)
    except (ResourceNotFoundError, InvalidOperationError) as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


@router.delete(
    "/{producto_id}",
    response_model=ProductoResponse,
    summary="Desactivar producto",
    description="Marca un producto como inactivo (borrado lógico)"
)
def desactivar_producto(
    producto_id: int,
    db: Session = Depends(get_db)
):
    """
    Desactivar un producto (soft delete).
    El historial de movimientos se mantiene.
    
    - **producto_id**: ID del producto
    """
    try:
        return ProductoService.desactivar_producto(db, producto_id)
    except ResourceNotFoundError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


@router.get(
    "/alertas/stock-bajo",
    response_model=list[ProductoAlertaStockBajo],
    summary="Productos con stock bajo",
    description="Obtiene lista de productos cuyo stock actual está por debajo del mínimo configurado"
)
def obtener_productos_stock_bajo(db: Session = Depends(get_db)):
    """
    Obtener productos con stock bajo.
    
    Retorna productos donde: stock_actual < stock_minimo
    """
    productos = ProductoService.obtener_productos_stock_bajo(db)
    
    return [
        ProductoAlertaStockBajo(
            id=p.id,
            nombre=p.nombre,
            sku=p.sku,
            stock_actual=p.stock_actual,
            stock_minimo=p.stock_minimo,
            categoria_id=p.categoria_id,
            diferencia=p.stock_actual - p.stock_minimo
        )
        for p in productos
    ]
