"""
Unit tests for Category Service.

Tests CRUD operations and business logic for categories.
"""

import pytest
from sqlalchemy.orm import Session

from src.schemas import CategoriaCreate, CategoriaUpdate
from src.services import CategoriaService
from src.exceptions import DuplicateResourceError, ResourceNotFoundError


class TestCategoriaService:
    """Test suite for CategoriaService."""

    def test_crear_categoria(self, db: Session):
        """Test creating a new category."""
        categoria_data = CategoriaCreate(
            nombre="Electronics",
            descripcion="Electronic products"
        )
        
        categoria = CategoriaService.crear_categoria(db, categoria_data)
        
        assert categoria.id is not None
        assert categoria.nombre == "Electronics"
        assert categoria.descripcion == "Electronic products"
        assert categoria.activo is True

    def test_crear_categoria_duplicada(self, db: Session, sample_category):
        """Test that duplicate category names raise error."""
        categoria_data = CategoriaCreate(
            nombre=sample_category.nombre,
            descripcion="Different description"
        )
        
        with pytest.raises(DuplicateResourceError):
            CategoriaService.crear_categoria(db, categoria_data)

    def test_obtener_categoria(self, db: Session, sample_category):
        """Test retrieving a category by ID."""
        categoria = CategoriaService.obtener_categoria(db, sample_category.id)
        
        assert categoria.id == sample_category.id
        assert categoria.nombre == sample_category.nombre

    def test_obtener_categoria_inexistente(self, db: Session):
        """Test that getting non-existent category raises error."""
        with pytest.raises(ResourceNotFoundError):
            CategoriaService.obtener_categoria(db, 9999)

    def test_listar_categorias(self, db: Session, sample_category):
        """Test listing all active categories."""
        # Create additional categories
        CategoriaService.crear_categoria(
            db,
            CategoriaCreate(nombre="Cat2", descripcion="Second category")
        )
        
        categorias = CategoriaService.listar_categorias(db)
        
        assert len(categorias) >= 2
        assert all(cat.activo for cat in categorias)

    def test_actualizar_categoria(self, db: Session, sample_category):
        """Test updating a category."""
        update_data = CategoriaUpdate(
            nombre="Updated Name",
            descripcion="Updated description"
        )
        
        categoria = CategoriaService.actualizar_categoria(
            db,
            sample_category.id,
            update_data
        )
        
        assert categoria.nombre == "Updated Name"
        assert categoria.descripcion == "Updated description"

    def test_actualizar_categoria_nombre_duplicado(self, db: Session):
        """Test that updating to duplicate name raises error."""
        # Create two categories
        cat1 = CategoriaService.crear_categoria(
            db,
            CategoriaCreate(nombre="Cat1")
        )
        cat2 = CategoriaService.crear_categoria(
            db,
            CategoriaCreate(nombre="Cat2")
        )
        
        # Try to rename cat2 to cat1's name
        with pytest.raises(DuplicateResourceError):
            CategoriaService.actualizar_categoria(
                db,
                cat2.id,
                CategoriaUpdate(nombre="Cat1")
            )

    def test_desactivar_categoria(self, db: Session, sample_category):
        """Test deactivating a category."""
        categoria = CategoriaService.desactivar_categoria(db, sample_category.id)
        
        assert categoria.activo is False
        
        # Verify it's not returned in list
        categorias = CategoriaService.listar_categorias(db)
        assert categoria.id not in [c.id for c in categorias]

    def test_desactivar_categoria_inexistente(self, db: Session):
        """Test that deactivating non-existent category raises error."""
        with pytest.raises(ResourceNotFoundError):
            CategoriaService.desactivar_categoria(db, 9999)
