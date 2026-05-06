"""
Unit tests for Product Service.

Tests CRUD operations, stock management and business logic for products.
"""

import pytest
from sqlalchemy.orm import Session

from src.schemas import ProductoCreate, ProductoUpdate
from src.services import ProductoService, CategoriaService
from src.schemas import CategoriaCreate
from src.exceptions import (
    DuplicateResourceError,
    ResourceNotFoundError,
    InvalidOperationError,
)


class TestProductoService:
    """Test suite for ProductoService."""

    def test_crear_producto(self, db: Session, sample_category):
        """Test creating a new product."""
        producto_data = ProductoCreate(
            nombre="Test Laptop",
            sku="LAP-001",
            categoria_id=sample_category.id,
            precio=999.99,
            stock_inicial=10,
            stock_minimo=2
        )
        
        producto = ProductoService.crear_producto(db, producto_data)
        
        assert producto.id is not None
        assert producto.sku == "LAP-001"
        assert producto.stock_actual == 10
        assert producto.activo is True

    def test_crear_producto_sku_duplicado(self, db: Session, sample_product):
        """Test that duplicate SKU raises error."""
        producto_data = ProductoCreate(
            nombre="Different Name",
            sku=sample_product.sku,
            categoria_id=sample_product.categoria_id,
            precio=49.99,
            stock_inicial=5
        )
        
        with pytest.raises(DuplicateResourceError):
            ProductoService.crear_producto(db, producto_data)

    def test_crear_producto_categoria_inexistente(self, db: Session):
        """Test that product with non-existent category raises error."""
        producto_data = ProductoCreate(
            nombre="Test Product",
            sku="TEST-001",
            categoria_id=9999,
            precio=50.0,
            stock_inicial=10
        )
        
        with pytest.raises(InvalidOperationError):
            ProductoService.crear_producto(db, producto_data)

    def test_obtener_producto(self, db: Session, sample_product):
        """Test retrieving a product by ID."""
        producto = ProductoService.obtener_producto(db, sample_product.id)
        
        assert producto.id == sample_product.id
        assert producto.sku == sample_product.sku

    def test_obtener_producto_inactivo(self, db: Session, sample_product):
        """Test that inactive products raise not found error."""
        # Deactivate product
        ProductoService.desactivar_producto(db, sample_product.id)
        
        with pytest.raises(ResourceNotFoundError):
            ProductoService.obtener_producto(db, sample_product.id)

    def test_listar_productos(self, db: Session, sample_product):
        """Test listing all active products."""
        productos = ProductoService.listar_productos(db)
        
        assert len(productos) >= 1
        assert all(p.activo for p in productos)

    def test_actualizar_producto(self, db: Session, sample_product):
        """Test updating a product."""
        update_data = ProductoUpdate(
            nombre="Updated Product Name",
            precio=129.99,
            stock_minimo=5
        )
        
        producto = ProductoService.actualizar_producto(
            db,
            sample_product.id,
            update_data
        )
        
        assert producto.nombre == "Updated Product Name"
        assert producto.precio == 129.99
        assert producto.stock_minimo == 5

    def test_actualizar_producto_categoria_invalida(self, db: Session, sample_product):
        """Test that updating to non-existent category raises error."""
        update_data = ProductoUpdate(categoria_id=9999)
        
        with pytest.raises(InvalidOperationError):
            ProductoService.actualizar_producto(db, sample_product.id, update_data)

    def test_desactivar_producto(self, db: Session, sample_product):
        """Test deactivating a product."""
        producto = ProductoService.desactivar_producto(db, sample_product.id)
        
        assert producto.activo is False

    def test_obtener_productos_stock_bajo(self, db: Session, sample_category):
        """Test getting products with low stock."""
        # Create product with low stock
        producto = ProductoService.crear_producto(
            db,
            ProductoCreate(
                nombre="Low Stock Product",
                sku="LOW-001",
                categoria_id=sample_category.id,
                precio=10.0,
                stock_inicial=5,
                stock_minimo=20
            )
        )
        
        bajos = ProductoService.obtener_productos_stock_bajo(db)
        
        assert len(bajos) >= 1
        assert producto.id in [p.id for p in bajos]

    def test_obtener_productos_stock_bajo_sin_minimo(self, db: Session, sample_category):
        """Test that products without minimum stock are not alerted."""
        # Create product with stock_minimo = 0
        ProductoService.crear_producto(
            db,
            ProductoCreate(
                nombre="No Min Stock",
                sku="NO-MIN-001",
                categoria_id=sample_category.id,
                precio=10.0,
                stock_inicial=0,
                stock_minimo=0
            )
        )
        
        bajos = ProductoService.obtener_productos_stock_bajo(db)
        
        # Should not include this product
        assert all(p.stock_minimo > 0 for p in bajos)
