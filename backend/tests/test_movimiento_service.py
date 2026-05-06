"""
Unit tests for Inventory Movement Service.

Tests stock entry/exit operations, validations and historical queries.
"""

import pytest
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from src.schemas import MovimientoEntrada, MovimientoSalida, MovementTypeEnum
from src.services import MovimientoService, ProductoService
from src.exceptions import (
    InsufficientStockError,
    InvalidOperationError,
    ResourceNotFoundError,
)


class TestMovimientoService:
    """Test suite for MovimientoService."""

    def test_registrar_entrada(self, db: Session, sample_product):
        """Test registering a stock entry."""
        movimiento_data = MovimientoEntrada(
            producto_id=sample_product.id,
            cantidad=50,
            motivo="Compra a proveedor",
            usuario="test_user"
        )
        
        # Get initial stock
        initial_stock = sample_product.stock_actual
        
        movimiento = MovimientoService.registrar_entrada(db, movimiento_data)
        
        # Refresh to get updated stock
        db.refresh(sample_product)
        
        assert movimiento.tipo == MovementTypeEnum.ENTRADA
        assert movimiento.cantidad == 50
        assert movimiento.stock_resultante == initial_stock + 50
        assert sample_product.stock_actual == initial_stock + 50

    def test_registrar_entrada_producto_inexistente(self, db: Session):
        """Test that entry for non-existent product raises error."""
        movimiento_data = MovimientoEntrada(
            producto_id=9999,
            cantidad=10,
            motivo="Test"
        )
        
        with pytest.raises(InvalidOperationError):
            MovimientoService.registrar_entrada(db, movimiento_data)

    def test_registrar_salida(self, db: Session, sample_product):
        """Test registering a stock exit."""
        initial_stock = sample_product.stock_actual
        cantidad_salida = 30
        
        movimiento_data = MovimientoSalida(
            producto_id=sample_product.id,
            cantidad=cantidad_salida,
            motivo="Venta cliente",
            usuario="test_user"
        )
        
        movimiento = MovimientoService.registrar_salida(db, movimiento_data)
        
        # Refresh to get updated stock
        db.refresh(sample_product)
        
        assert movimiento.tipo == MovementTypeEnum.SALIDA
        assert movimiento.cantidad == cantidad_salida
        assert movimiento.stock_resultante == initial_stock - cantidad_salida
        assert sample_product.stock_actual == initial_stock - cantidad_salida

    def test_registrar_salida_stock_insuficiente(self, db: Session, sample_product):
        """Test that exit with insufficient stock raises error."""
        movimiento_data = MovimientoSalida(
            producto_id=sample_product.id,
            cantidad=sample_product.stock_actual + 100,  # More than available
            motivo="Venta"
        )
        
        with pytest.raises(InsufficientStockError):
            MovimientoService.registrar_salida(db, movimiento_data)

    def test_registrar_salida_stock_cero(self, db: Session, sample_product):
        """Test that exit of zero stock raises error."""
        movimiento_data = MovimientoSalida(
            producto_id=sample_product.id,
            cantidad=0,
            motivo="Test"
        )
        
        # This should fail at Pydantic validation level
        with pytest.raises(Exception):  # Validation error
            MovimientoService.registrar_salida(db, movimiento_data)

    def test_obtener_historial_producto(self, db: Session, sample_product, sample_movement):
        """Test retrieving product movement history."""
        total, movimientos = MovimientoService.obtener_historial_producto(
            db,
            sample_product.id
        )
        
        assert total >= 1
        assert len(movimientos) == total
        # Should be ordered by date DESC
        if len(movimientos) > 1:
            assert movimientos[0].fecha_hora >= movimientos[1].fecha_hora

    def test_obtener_historial_con_filtro_fecha(self, db: Session, sample_product):
        """Test filtering history by date range."""
        # Register multiple movements
        desde = datetime.utcnow()
        
        MovimientoService.registrar_entrada(
            db,
            MovimientoEntrada(
                producto_id=sample_product.id,
                cantidad=10,
                motivo="Entry 1",
                fecha_hora=desde
            )
        )
        
        hasta = desde + timedelta(hours=2)
        
        total, movimientos = MovimientoService.obtener_historial_producto(
            db,
            sample_product.id,
            desde=desde,
            hasta=hasta
        )
        
        assert total >= 0
        # All movements should be within range
        for mov in movimientos:
            assert desde <= mov.fecha_hora <= hasta

    def test_obtener_historial_con_filtro_tipo(self, db: Session, sample_product):
        """Test filtering history by movement type."""
        # Register entry
        MovimientoService.registrar_entrada(
            db,
            MovimientoEntrada(
                producto_id=sample_product.id,
                cantidad=50,
                motivo="Entry"
            )
        )
        
        # Register exit
        MovimientoService.registrar_salida(
            db,
            MovimientoSalida(
                producto_id=sample_product.id,
                cantidad=10,
                motivo="Exit"
            )
        )
        
        # Get only entries
        total_entries, entradas = MovimientoService.obtener_historial_producto(
            db,
            sample_product.id,
            tipo=MovementTypeEnum.ENTRADA
        )
        
        assert all(m.tipo == MovementTypeEnum.ENTRADA for m in entradas)

    def test_obtener_movimiento(self, db: Session, sample_movement):
        """Test retrieving a specific movement."""
        movimiento = MovimientoService.obtener_movimiento(db, sample_movement.id)
        
        assert movimiento.id == sample_movement.id
        assert movimiento.cantidad == sample_movement.cantidad

    def test_obtener_movimiento_inexistente(self, db: Session):
        """Test that getting non-existent movement raises error."""
        with pytest.raises(ResourceNotFoundError):
            MovimientoService.obtener_movimiento(db, 9999)

    def test_stock_nunca_negativo(self, db: Session, sample_product):
        """Test that stock can never go negative (RN-11)."""
        # Verify product has stock
        assert sample_product.stock_actual > 0
        
        # Try to remove more than available
        with pytest.raises(InsufficientStockError):
            MovimientoService.registrar_salida(
                db,
                MovimientoSalida(
                    producto_id=sample_product.id,
                    cantidad=sample_product.stock_actual + 1,
                    motivo="Test"
                )
            )
        
        # Verify stock is unchanged
        db.refresh(sample_product)
        assert sample_product.stock_actual >= 0
