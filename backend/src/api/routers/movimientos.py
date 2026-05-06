"""
API endpoints for Inventory Movement management.

Implements endpoints for registering stock entries/exits and consulting movement history
with filtering and trazability features.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from src.db import get_db
from src.schemas import (
    MovimientoEntrada,
    MovimientoSalida,
    MovimientoResponse,
    HistorialResponse,
    MovementTypeEnum,
)
from src.services import MovimientoService
from src.exceptions import (
    ResourceNotFoundError,
    InvalidOperationError,
    InsufficientStockError,
)

router = APIRouter(prefix="/api/movimientos", tags=["Movimientos"])


@router.post(
    "/entradas",
    response_model=MovimientoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar entrada de stock",
    description="Registra una entrada de inventario (incremento de stock)"
)
def registrar_entrada(
    movimiento: MovimientoEntrada,
    db: Session = Depends(get_db)
):
    """
    Registrar una entrada de stock.
    
    - **producto_id**: ID del producto (requerido)
    - **cantidad**: Cantidad a aumentar (> 0, requerido)
    - **motivo**: Razón de la entrada (requerido)
    - **usuario**: Usuario responsable (default: "sistema")
    - **fecha_hora**: Fecha del movimiento (default: ahora, no puede ser futura)
    
    RN-11: El stock nunca puede ser negativo.
    RN-14: El stock se actualiza inmediatamente.
    """
    try:
        return MovimientoService.registrar_entrada(db, movimiento)
    except (ResourceNotFoundError, InvalidOperationError) as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


@router.post(
    "/salidas",
    response_model=MovimientoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar salida de stock",
    description="Registra una salida de inventario (decremento de stock)"
)
def registrar_salida(
    movimiento: MovimientoSalida,
    db: Session = Depends(get_db)
):
    """
    Registrar una salida de stock.
    
    - **producto_id**: ID del producto (requerido)
    - **cantidad**: Cantidad a disminuir (> 0, requerido)
    - **motivo**: Razón de la salida (requerido)
    - **usuario**: Usuario responsable (default: "sistema")
    - **fecha_hora**: Fecha del movimiento (default: ahora, no puede ser futura)
    
    RN-11: No se permite stock negativo. Validará que exista stock suficiente.
    RN-15: Se valida que la salida no exceda el stock disponible.
    RN-14: El stock se actualiza inmediatamente.
    """
    try:
        return MovimientoService.registrar_salida(db, movimiento)
    except (
        ResourceNotFoundError,
        InvalidOperationError,
        InsufficientStockError
    ) as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


@router.get(
    "/historial/{producto_id}",
    response_model=HistorialResponse,
    summary="Consultar historial de movimientos",
    description="Obtiene el historial de movimientos de un producto con opciones de filtrado"
)
def obtener_historial(
    producto_id: int,
    desde: Optional[datetime] = Query(
        None,
        description="Fecha inicial del rango (inclusive)"
    ),
    hasta: Optional[datetime] = Query(
        None,
        description="Fecha final del rango (inclusive)"
    ),
    tipo: Optional[MovementTypeEnum] = Query(
        None,
        description="Filtrar por tipo: 'entrada', 'salida' o ambos"
    ),
    db: Session = Depends(get_db)
):
    """
    Consultar historial de movimientos de un producto.
    
    - **producto_id**: ID del producto (requerido)
    - **desde**: Fecha inicial (opcional, formato ISO 8601)
    - **hasta**: Fecha final (opcional, formato ISO 8601)
    - **tipo**: Filtrar por tipo de movimiento (opcional: entrada/salida)
    
    RN-15: Los resultados se ordenan por fecha descendente (más recientes primero).
    RN-17: Se incluye stock_resultante para garantizar trazabilidad.
    
    Ejemplo: /api/movimientos/historial/1?desde=2024-01-01&hasta=2024-12-31&tipo=entrada
    """
    try:
        # Validate date range
        if desde and hasta and desde > hasta:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La fecha 'desde' no puede ser mayor que 'hasta'"
            )
        
        total, movimientos = MovimientoService.obtener_historial_producto(
            db,
            producto_id,
            desde=desde,
            hasta=hasta,
            tipo=tipo
        )
        
        return HistorialResponse(
            total=total,
            movimientos=movimientos
        )
    except ResourceNotFoundError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


@router.get(
    "/{movimiento_id}",
    response_model=MovimientoResponse,
    summary="Obtener detalle de movimiento",
    description="Obtiene los detalles de un movimiento específico"
)
def obtener_movimiento(
    movimiento_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtener un movimiento por ID.
    
    - **movimiento_id**: ID del movimiento
    """
    try:
        return MovimientoService.obtener_movimiento(db, movimiento_id)
    except ResourceNotFoundError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )
