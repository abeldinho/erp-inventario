"""
Service layer for Category management.

Handles all business logic related to categories including CRUD operations,
validation and error handling.
"""

from sqlalchemy.orm import Session
from src.models import Category
from src.schemas import CategoriaCreate, CategoriaUpdate
from src.exceptions import ResourceNotFoundError, DuplicateResourceError


class CategoriaService:
    """Business logic for category operations."""

    @staticmethod
    def crear_categoria(db: Session, categoria: CategoriaCreate) -> Category:
        """
        Create a new category.
        
        Args:
            db: Database session.
            categoria: Category data.
            
        Returns:
            Created Category object.
            
        Raises:
            DuplicateResourceError: If nombre already exists.
        """
        # Check if category name already exists
        categoria_existente = db.query(Category).filter(
            Category.nombre == categoria.nombre
        ).first()
        
        if categoria_existente:
            raise DuplicateResourceError("Categoría", categoria.nombre)
        
        # Create new category
        db_categoria = Category(
            nombre=categoria.nombre,
            descripcion=categoria.descripcion
        )
        db.add(db_categoria)
        db.commit()
        db.refresh(db_categoria)
        return db_categoria

    @staticmethod
    def obtener_categoria(db: Session, categoria_id: int) -> Category:
        """
        Get a category by ID.
        
        Args:
            db: Database session.
            categoria_id: Category ID.
            
        Returns:
            Category object.
            
        Raises:
            ResourceNotFoundError: If category not found.
        """
        categoria = db.query(Category).filter(
            Category.id == categoria_id,
            Category.activo == True
        ).first()
        
        if not categoria:
            raise ResourceNotFoundError("Categoría", categoria_id)
        
        return categoria

    @staticmethod
    def listar_categorias(db: Session) -> list[Category]:
        """
        Get all active categories ordered alphabetically.
        
        Args:
            db: Database session.
            
        Returns:
            List of active Category objects.
        """
        return db.query(Category).filter(
            Category.activo == True
        ).order_by(Category.nombre).all()

    @staticmethod
    def actualizar_categoria(
        db: Session, 
        categoria_id: int, 
        categoria_update: CategoriaUpdate
    ) -> Category:
        """
        Update an existing category.
        
        Args:
            db: Database session.
            categoria_id: Category ID.
            categoria_update: Updated category data.
            
        Returns:
            Updated Category object.
            
        Raises:
            ResourceNotFoundError: If category not found.
            DuplicateResourceError: If new nombre already exists.
        """
        db_categoria = CategoriaService.obtener_categoria(db, categoria_id)
        
        # If nombre is being updated, check for duplicates
        if categoria_update.nombre and categoria_update.nombre != db_categoria.nombre:
            categoria_duplicada = db.query(Category).filter(
                Category.nombre == categoria_update.nombre,
                Category.id != categoria_id
            ).first()
            if categoria_duplicada:
                raise DuplicateResourceError("Categoría", categoria_update.nombre)
        
        # Update fields
        update_data = categoria_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_categoria, field, value)
        
        db.add(db_categoria)
        db.commit()
        db.refresh(db_categoria)
        return db_categoria

    @staticmethod
    def desactivar_categoria(db: Session, categoria_id: int) -> Category:
        """
        Deactivate a category (soft delete).
        
        Args:
            db: Database session.
            categoria_id: Category ID.
            
        Returns:
            Deactivated Category object.
            
        Raises:
            ResourceNotFoundError: If category not found.
        """
        db_categoria = db.query(Category).filter(
            Category.id == categoria_id
        ).first()
        
        if not db_categoria:
            raise ResourceNotFoundError("Categoría", categoria_id)
        
        db_categoria.activo = False
        db.add(db_categoria)
        db.commit()
        db.refresh(db_categoria)
        return db_categoria
