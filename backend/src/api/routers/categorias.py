"""
API endpoints for Category management.

Implements CRUD operations for categories following REST conventions.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.db import get_db
from src.schemas import (
    CategoriaCreate,
    CategoriaUpdate,
    CategoriaResponse,
)
from src.services import CategoriaService
from src.exceptions import (
    DuplicateResourceError,
    ResourceNotFoundError,
    InventoryException,
)

router = APIRouter(prefix="/api/categorias", tags=["Categorías"])


@router.post(
    "",
    response_model=CategoriaResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear categoría",
    description="Crea una nueva categoría para clasificar productos"
)
def crear_categoria(
    categoria: CategoriaCreate,
    db: Session = Depends(get_db)
):
    """
    Crear una nueva categoría.
    
    - **nombre**: Nombre único de la categoría (requerido)
    - **descripcion**: Descripción opcional
    """
    try:
        return CategoriaService.crear_categoria(db, categoria)
    except DuplicateResourceError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


@router.get(
    "",
    response_model=list[CategoriaResponse],
    summary="Listar categorías",
    description="Obtiene lista de todas las categorías activas ordenadas alfabéticamente"
)
def listar_categorias(db: Session = Depends(get_db)):
    """Obtener todas las categorías activas."""
    return CategoriaService.listar_categorias(db)


@router.get(
    "/{categoria_id}",
    response_model=CategoriaResponse,
    summary="Obtener categoría",
    description="Obtiene los detalles de una categoría específica"
)
def obtener_categoria(
    categoria_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtener una categoría por ID.
    
    - **categoria_id**: ID de la categoría
    """
    try:
        return CategoriaService.obtener_categoria(db, categoria_id)
    except ResourceNotFoundError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


@router.put(
    "/{categoria_id}",
    response_model=CategoriaResponse,
    summary="Actualizar categoría",
    description="Actualiza los datos de una categoría existente"
)
def actualizar_categoria(
    categoria_id: int,
    categoria: CategoriaUpdate,
    db: Session = Depends(get_db)
):
    """
    Actualizar una categoría existente.
    
    - **categoria_id**: ID de la categoría
    - **nombre**: Nuevo nombre (opcional)
    - **descripcion**: Nueva descripción (opcional)
    """
    try:
        return CategoriaService.actualizar_categoria(db, categoria_id, categoria)
    except (ResourceNotFoundError, DuplicateResourceError) as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


@router.delete(
    "/{categoria_id}",
    response_model=CategoriaResponse,
    summary="Desactivar categoría",
    description="Marca una categoría como inactiva (borrado lógico)"
)
def desactivar_categoria(
    categoria_id: int,
    db: Session = Depends(get_db)
):
    """
    Desactivar una categoría (soft delete).
    Los productos asociados no se eliminan.
    
    - **categoria_id**: ID de la categoría
    """
    try:
        return CategoriaService.desactivar_categoria(db, categoria_id)
    except ResourceNotFoundError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )
