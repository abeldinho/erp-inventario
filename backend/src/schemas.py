"""
Pydantic schemas for request/response validation and serialization.

Defines schemas for Products, Categories, Movements and API responses.
"""

from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional, List
from enum import Enum


class MovementTypeEnum(str, Enum):
    """Enum for inventory movement types."""
    ENTRADA = "entrada"
    SALIDA = "salida"


# ==================== CATEGORIA ====================

class CategoriaBase(BaseModel):
    """Base schema for Category without database-specific fields."""
    nombre: str = Field(..., min_length=1, max_length=100, description="Nombre único de la categoría")
    descripcion: Optional[str] = Field(None, max_length=500, description="Descripción opcional")


class CategoriaCreate(CategoriaBase):
    """Schema for creating a new category."""
    pass


class CategoriaUpdate(BaseModel):
    """Schema for updating a category."""
    nombre: Optional[str] = Field(None, min_length=1, max_length=100)
    descripcion: Optional[str] = Field(None, max_length=500)


class CategoriaResponse(CategoriaBase):
    """Schema for category responses."""
    id: int
    activo: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ==================== PRODUCTO ====================

class ProductoBase(BaseModel):
    """Base schema for Product without database-specific fields."""
    nombre: str = Field(..., min_length=1, max_length=150, description="Nombre del producto")
    descripcion: Optional[str] = Field(None, max_length=500)
    sku: str = Field(..., min_length=1, max_length=50, description="SKU único del producto")
    categoria_id: int = Field(..., gt=0, description="ID de la categoría")
    precio: float = Field(..., ge=0, description="Precio unitario")
    stock_minimo: int = Field(default=0, ge=0, description="Stock mínimo para alertas")

    @field_validator("precio")
    @classmethod
    def precio_positive_if_provided(cls, v):
        if v is not None and v < 0:
            raise ValueError("El precio no puede ser negativo")
        return v


class ProductoCreate(ProductoBase):
    """Schema for creating a new product."""
    stock_inicial: int = Field(default=0, ge=0, description="Stock inicial del producto")


class ProductoUpdate(BaseModel):
    """Schema for updating a product."""
    nombre: Optional[str] = Field(None, min_length=1, max_length=150)
    descripcion: Optional[str] = Field(None, max_length=500)
    sku: Optional[str] = Field(None, min_length=1, max_length=50)
    categoria_id: Optional[int] = Field(None, gt=0)
    precio: Optional[float] = Field(None, ge=0)
    stock_minimo: Optional[int] = Field(None, ge=0)


class ProductoResponse(ProductoBase):
    """Schema for product responses."""
    id: int
    stock_actual: int
    activo: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ==================== MOVIMIENTO ====================

class MovimientoBase(BaseModel):
    """Base schema for inventory movement without database-specific fields."""
    producto_id: int = Field(..., gt=0, description="ID del producto")
    cantidad: int = Field(..., gt=0, description="Cantidad a mover (siempre > 0)")
    motivo: str = Field(..., min_length=1, max_length=255, description="Razón del movimiento")
    usuario: str = Field(default="sistema", max_length=100, description="Usuario responsable")
    fecha_hora: Optional[datetime] = Field(None, description="Fecha del movimiento (default: ahora)")

    @field_validator("fecha_hora")
    @classmethod
    def fecha_no_futura(cls, v):
        """Validar que la fecha no sea futura."""
        if v and v > datetime.utcnow():
            raise ValueError("La fecha del movimiento no puede ser futura")
        return v


class MovimientoEntrada(MovimientoBase):
    """Schema for registering stock entry."""
    pass


class MovimientoSalida(MovimientoBase):
    """Schema for registering stock exit."""
    pass


class MovimientoResponse(BaseModel):
    """Schema for movement responses."""
    id: int
    producto_id: int
    tipo: MovementTypeEnum
    cantidad: int
    motivo: str
    fecha_hora: datetime
    usuario: str
    stock_resultante: int

    model_config = {"from_attributes": True}


# ==================== RESPUESTAS API ====================

class ErrorResponse(BaseModel):
    """Schema for error responses."""
    detail: str = Field(..., description="Descripción del error")
    status_code: int = Field(..., description="Código HTTP")


class SuccessResponse(BaseModel):
    """Schema for success messages."""
    message: str = Field(..., description="Mensaje de éxito")
    data: Optional[dict] = Field(None, description="Datos asociados")


# ==================== ALERTAS ====================

class ProductoAlertaStockBajo(BaseModel):
    """Schema for low stock alerts."""
    id: int
    nombre: str
    sku: str
    stock_actual: int
    stock_minimo: int
    categoria_id: int
    diferencia: int = Field(..., description="stock_actual - stock_minimo (siempre negativo)")

    model_config = {"from_attributes": True}


# ==================== HISTORIAL ====================

class FiltrosHistorial(BaseModel):
    """Schema for history filtering parameters."""
    desde: Optional[datetime] = Field(None, description="Fecha inicial (inclusive)")
    hasta: Optional[datetime] = Field(None, description="Fecha final (inclusive)")
    tipo: Optional[MovementTypeEnum] = Field(None, description="Filtrar por tipo de movimiento")

    @field_validator("hasta")
    @classmethod
    def validar_rango_fechas(cls, v, info):
        """Validar que hasta >= desde."""
        if v and "desde" in info.data and info.data["desde"]:
            if v < info.data["desde"]:
                raise ValueError("La fecha 'hasta' debe ser mayor o igual a 'desde'")
        return v


class HistorialResponse(BaseModel):
    """Schema for history query responses."""
    total: int = Field(..., description="Total de registros")
    movimientos: List[MovimientoResponse] = Field(..., description="Lista de movimientos")

    model_config = {"from_attributes": True}
