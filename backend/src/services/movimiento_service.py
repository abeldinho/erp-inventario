"""
Service layer for Inventory Movement management.

Handles all business logic related to inventory movements (entries/exits),
stock calculations, validations and historical tracking.
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
from src.models import MovimientoInventario, Producto, MovementTypeEnum
from src.schemas import MovimientoEntrada, MovimientoSalida
from src.exceptions import (
    ResourceNotFoundError,
    InvalidOperationError,
    InsufficientStockError,
)
from src.services.producto_service import ProductoService


class MovimientoService:
    """Business logic for inventory movement operations."""

    @staticmethod
    def registrar_entrada(
        db: Session,
        movimiento: MovimientoEntrada
    ) -> MovimientoInventario:
        """
        Register a stock entry (increase).
        
        Args:
            db: Database session.
            movimiento: Entry movement data.
            
        Returns:
            Created MovimientoInventario object.
            
        Raises:
            InvalidOperationError: If quantity <= 0 or product inactive.
        """
        # Validate product exists and is active
        producto = ProductoService.validar_producto_activo(db, movimiento.producto_id)
        
        # Set fecha_hora if not provided
        fecha_hora = movimiento.fecha_hora or datetime.utcnow()
        
        # Calculate new stock
        nuevo_stock = producto.stock_actual + movimiento.cantidad
        
        # Create movement record
        db_movimiento = MovimientoInventario(
            producto_id=movimiento.producto_id,
            tipo=MovementTypeEnum.ENTRADA,
            cantidad=movimiento.cantidad,
            motivo=movimiento.motivo,
            fecha_hora=fecha_hora,
            usuario=movimiento.usuario,
            stock_resultante=nuevo_stock
        )
        
        # Update product stock
        producto.stock_actual = nuevo_stock
        
        # Persist changes
        db.add(db_movimiento)
        db.add(producto)
        db.commit()
        db.refresh(db_movimiento)
        
        return db_movimiento

    @staticmethod
    def registrar_salida(
        db: Session,
        movimiento: MovimientoSalida
    ) -> MovimientoInventario:
        """
        Register a stock exit (decrease).
        
        Args:
            db: Database session.
            movimiento: Exit movement data.
            
        Returns:
            Created MovimientoInventario object.
            
        Raises:
            InvalidOperationError: If quantity <= 0 or product inactive.
            InsufficientStockError: If stock is insufficient.
        """
        # Validate product exists and is active
        producto = ProductoService.validar_producto_activo(db, movimiento.producto_id)
        
        # Validate sufficient stock (RN-11: No negativos)
        if producto.stock_actual < movimiento.cantidad:
            raise InsufficientStockError(
                product_name=producto.nombre,
                available=producto.stock_actual,
                requested=movimiento.cantidad
            )
        
        # Set fecha_hora if not provided
        fecha_hora = movimiento.fecha_hora or datetime.utcnow()
        
        # Calculate new stock
        nuevo_stock = producto.stock_actual - movimiento.cantidad
        
        # Create movement record
        db_movimiento = MovimientoInventario(
            producto_id=movimiento.producto_id,
            tipo=MovementTypeEnum.SALIDA,
            cantidad=movimiento.cantidad,
            motivo=movimiento.motivo,
            fecha_hora=fecha_hora,
            usuario=movimiento.usuario,
            stock_resultante=nuevo_stock
        )
        
        # Update product stock
        producto.stock_actual = nuevo_stock
        
        # Persist changes
        db.add(db_movimiento)
        db.add(producto)
        db.commit()
        db.refresh(db_movimiento)
        
        return db_movimiento

    @staticmethod
    def obtener_historial_producto(
        db: Session,
        producto_id: int,
        desde: datetime = None,
        hasta: datetime = None,
        tipo: MovementTypeEnum = None
    ) -> tuple[int, list[MovimientoInventario]]:
        """
        Get movement history for a product with optional filters.
        
        Args:
            db: Database session.
            producto_id: Product ID.
            desde: Start date (inclusive).
            hasta: End date (inclusive).
            tipo: Filter by movement type (entrada/salida/None for all).
            
        Returns:
            Tuple of (total_count, movements_list) ordered by date DESC.
            
        Raises:
            ResourceNotFoundError: If product not found.
        """
        # Validate product exists
        ProductoService.obtener_producto(db, producto_id)
        
        # Build query
        query = db.query(MovimientoInventario).filter(
            MovimientoInventario.producto_id == producto_id
        )
        
        # Apply date filters
        if desde:
            query = query.filter(MovimientoInventario.fecha_hora >= desde)
        
        if hasta:
            query = query.filter(MovimientoInventario.fecha_hora <= hasta)
        
        # Apply type filter
        if tipo:
            query = query.filter(MovimientoInventario.tipo == tipo)
        
        # Order by date descending and count
        movimientos = query.order_by(
            MovimientoInventario.fecha_hora.desc()
        ).all()
        
        return len(movimientos), movimientos

    @staticmethod
    def obtener_movimiento(db: Session, movimiento_id: int) -> MovimientoInventario:
        """
        Get a specific movement by ID.
        
        Args:
            db: Database session.
            movimiento_id: Movement ID.
            
        Returns:
            MovimientoInventario object.
            
        Raises:
            ResourceNotFoundError: If movement not found.
        """
        movimiento = db.query(MovimientoInventario).filter(
            MovimientoInventario.id == movimiento_id
        ).first()
        
        if not movimiento:
            raise ResourceNotFoundError("Movimiento", movimiento_id)
        
        return movimiento
