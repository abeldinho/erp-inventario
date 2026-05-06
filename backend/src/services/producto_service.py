"""
Service layer for Product management.

Handles all business logic related to products including CRUD operations,
validation, stock calculations and error handling.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func
from src.models import Producto, Category
from src.schemas import ProductoCreate, ProductoUpdate
from src.exceptions import (
    ResourceNotFoundError,
    DuplicateResourceError,
    InvalidOperationError,
)


class ProductoService:
    """Business logic for product operations."""

    @staticmethod
    def crear_producto(db: Session, producto: ProductoCreate) -> Producto:
        """
        Create a new product.
        
        Args:
            db: Database session.
            producto: Product data.
            
        Returns:
            Created Product object.
            
        Raises:
            DuplicateResourceError: If SKU already exists.
            InvalidOperationError: If category doesn't exist or is inactive.
        """
        # Validate SKU uniqueness
        sku_existente = db.query(Producto).filter(
            Producto.sku == producto.sku
        ).first()
        
        if sku_existente:
            raise DuplicateResourceError("SKU", producto.sku)
        
        # Validate category exists and is active
        categoria = db.query(Category).filter(
            Category.id == producto.categoria_id,
            Category.activo == True
        ).first()
        
        if not categoria:
            raise InvalidOperationError(
                f"Categoría con ID {producto.categoria_id} no existe o está inactiva"
            )
        
        # Create product
        db_producto = Producto(
            nombre=producto.nombre,
            descripcion=producto.descripcion,
            sku=producto.sku,
            categoria_id=producto.categoria_id,
            precio=producto.precio,
            stock_actual=producto.stock_inicial,
            stock_minimo=producto.stock_minimo,
        )
        db.add(db_producto)
        db.commit()
        db.refresh(db_producto)
        return db_producto

    @staticmethod
    def obtener_producto(db: Session, producto_id: int) -> Producto:
        """
        Get a product by ID (only active products).
        
        Args:
            db: Database session.
            producto_id: Product ID.
            
        Returns:
            Product object.
            
        Raises:
            ResourceNotFoundError: If product not found.
        """
        producto = db.query(Producto).filter(
            Producto.id == producto_id,
            Producto.activo == True
        ).first()
        
        if not producto:
            raise ResourceNotFoundError("Producto", producto_id)
        
        return producto

    @staticmethod
    def listar_productos(db: Session) -> list[Producto]:
        """
        Get all active products ordered by creation date.
        
        Args:
            db: Database session.
            
        Returns:
            List of active Product objects.
        """
        return db.query(Producto).filter(
            Producto.activo == True
        ).order_by(Producto.created_at.desc()).all()

    @staticmethod
    def actualizar_producto(
        db: Session,
        producto_id: int,
        producto_update: ProductoUpdate
    ) -> Producto:
        """
        Update an existing product.
        
        Args:
            db: Database session.
            producto_id: Product ID.
            producto_update: Updated product data.
            
        Returns:
            Updated Product object.
            
        Raises:
            ResourceNotFoundError: If product not found.
            InvalidOperationError: If new category is invalid.
            DuplicateResourceError: If SKU already exists in another active product.
        """
        db_producto = ProductoService.obtener_producto(db, producto_id)

        # Validate category if being updated
        if producto_update.categoria_id:
            categoria = db.query(Category).filter(
                Category.id == producto_update.categoria_id,
                Category.activo == True
            ).first()
            if not categoria:
                raise InvalidOperationError(
                    f"Categoría con ID {producto_update.categoria_id} no existe o está inactiva"
                )

        # Validate unique SKU among active products (exclude current product)
        if producto_update.sku:
            sku_existente = db.query(Producto).filter(
                Producto.sku == producto_update.sku,
                Producto.id != producto_id,
                Producto.activo == True
            ).first()
            if sku_existente:
                raise DuplicateResourceError("SKU", producto_update.sku)
        
        # Update fields
        update_data = producto_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_producto, field, value)
        
        db.add(db_producto)
        db.commit()
        db.refresh(db_producto)
        return db_producto

    @staticmethod
    def desactivar_producto(db: Session, producto_id: int) -> Producto:
        """
        Deactivate a product (soft delete).
        
        Args:
            db: Database session.
            producto_id: Product ID.
            
        Returns:
            Deactivated Product object.
            
        Raises:
            ResourceNotFoundError: If product not found.
        """
        db_producto = db.query(Producto).filter(
            Producto.id == producto_id
        ).first()
        
        if not db_producto:
            raise ResourceNotFoundError("Producto", producto_id)
        
        db_producto.activo = False
        db.add(db_producto)
        db.commit()
        db.refresh(db_producto)
        return db_producto

    @staticmethod
    def obtener_productos_stock_bajo(db: Session) -> list[Producto]:
        """
        Get all active products with stock below minimum level.
        
        Args:
            db: Database session.
            
        Returns:
            List of products with low stock (stock_actual < stock_minimo).
        """
        return db.query(Producto).filter(
            Producto.activo == True,
            Producto.stock_actual < Producto.stock_minimo,
            Producto.stock_minimo > 0
        ).order_by(
            (Producto.stock_minimo - Producto.stock_actual).desc()
        ).all()

    @staticmethod
    def validar_producto_activo(db: Session, producto_id: int) -> Producto:
        """
        Validate that a product exists and is active.
        Used for operations like registering movements.
        
        Args:
            db: Database session.
            producto_id: Product ID.
            
        Returns:
            Product object.
            
        Raises:
            ResourceNotFoundError: If product not found or inactive.
        """
        producto = db.query(Producto).filter(
            Producto.id == producto_id,
            Producto.activo == True
        ).first()
        
        if not producto:
            raise InvalidOperationError(
                "Producto no existe o está inactivo. No se pueden registrar movimientos."
            )
        
        return producto
