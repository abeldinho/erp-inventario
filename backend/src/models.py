"""
Domain models for Inventory Manager.

Defines SQLAlchemy ORM models for Products, Categories, Movements and System Configuration.
Implements soft deletes, timestamps and referential integrity.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from src.db import Base


class MovementTypeEnum(str, enum.Enum):
    """Enum for inventory movement types."""
    ENTRADA = "entrada"
    SALIDA = "salida"


class Category(Base):
    """
    Categoría - Clasifica productos en el sistema.
    
    Attributes:
        id: Identificador único (PK).
        nombre: Nombre único de la categoría.
        descripcion: Descripción opcional.
        activo: Indica si la categoría está activa (soft delete).
        created_at: Fecha de creación.
        productos: Relación 1-N con Producto.
    """
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), unique=True, nullable=False, index=True)
    descripcion = Column(String(500), nullable=True)
    activo = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    productos = relationship("Producto", back_populates="categoria")

    def __repr__(self) -> str:
        return f"<Category(id={self.id}, nombre='{self.nombre}', activo={self.activo})>"


class Producto(Base):
    """
    Producto - Representa un ítem del inventario.
    
    Attributes:
        id: Identificador único (PK).
        nombre: Nombre del producto.
        descripcion: Descripción opcional.
        sku: Stock Keeping Unit - Identificador único del producto.
        categoria_id: FK a Categoría.
        precio: Precio unitario.
        stock_actual: Stock actual (calculado desde movimientos).
        stock_minimo: Nivel mínimo para alertas.
        activo: Indica si el producto está activo (soft delete).
        created_at: Fecha de creación.
        updated_at: Última actualización.
        categoria: Relación N-1 con Categoría.
        movimientos: Relación 1-N con MovimientoInventario.
    """
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False, index=True)
    descripcion = Column(String(500), nullable=True)
    sku = Column(String(50), unique=True, nullable=False, index=True)
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)
    precio = Column(Float, nullable=False, default=0.0)
    stock_actual = Column(Integer, nullable=False, default=0)
    stock_minimo = Column(Integer, nullable=False, default=0)
    activo = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    categoria = relationship("Category", back_populates="productos")
    movimientos = relationship("MovimientoInventario", back_populates="producto", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Producto(id={self.id}, sku='{self.sku}', stock={self.stock_actual}, activo={self.activo})>"


class MovimientoInventario(Base):
    """
    Movimiento de Inventario - Registra cambios de stock.
    
    Attributes:
        id: Identificador único (PK).
        producto_id: FK a Producto.
        tipo: Tipo de movimiento (entrada/salida).
        cantidad: Cantidad movida (siempre > 0).
        motivo: Razón del movimiento.
        fecha_hora: Timestamp exacto del movimiento.
        usuario: Usuario responsable.
        stock_resultante: Stock después del movimiento (para auditoría).
        producto: Relación N-1 con Producto.
    """
    __tablename__ = "movimientos_inventario"

    id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    tipo = Column(SQLEnum(MovementTypeEnum), nullable=False)
    cantidad = Column(Integer, nullable=False)
    motivo = Column(String(255), nullable=False)
    fecha_hora = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    usuario = Column(String(100), nullable=False)
    stock_resultante = Column(Integer, nullable=False)

    # Relationships
    producto = relationship("Producto", back_populates="movimientos")

    def __repr__(self) -> str:
        return f"<MovimientoInventario(id={self.id}, tipo={self.tipo}, cantidad={self.cantidad})>"


class ConfiguracionSistema(Base):
    """
    System Configuration - Almacena settings generales.
    
    Attributes:
        id: Identificador único (PK).
        clave: Clave única de configuración.
        valor: Valor de la configuración.
    """
    __tablename__ = "configuracion_sistema"

    id = Column(Integer, primary_key=True, index=True)
    clave = Column(String(100), unique=True, nullable=False, index=True)
    valor = Column(String(500), nullable=False)

    def __repr__(self) -> str:
        return f"<ConfiguracionSistema(clave='{self.clave}', valor='{self.valor}')>"
