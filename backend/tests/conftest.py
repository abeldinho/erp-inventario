"""
Pytest configuration and fixtures for testing.

Provides test database setup, FastAPI test client and sample data fixtures.
"""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from fastapi.testclient import TestClient

from src.db import Base, get_db
from main import app
from src.models import Category, Producto, MovementTypeEnum, MovimientoInventario
from datetime import datetime


# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


# Create test database tables
Base.metadata.create_all(bind=engine)

# Override the get_db dependency
app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
def db() -> Session:
    """Provide a test database session."""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client():
    """Provide a test client for FastAPI."""
    return TestClient(app)


@pytest.fixture
def sample_category(db: Session) -> Category:
    """Create a sample category for testing."""
    category = Category(
        nombre="Test Category",
        descripcion="Categoría de prueba",
        activo=True
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@pytest.fixture
def sample_product(db: Session, sample_category: Category) -> Producto:
    """Create a sample product for testing."""
    product = Producto(
        nombre="Test Product",
        descripcion="Producto de prueba",
        sku="TEST-SKU-001",
        categoria_id=sample_category.id,
        precio=99.99,
        stock_actual=100,
        stock_minimo=10,
        activo=True
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@pytest.fixture
def sample_movement(db: Session, sample_product: Producto) -> MovimientoInventario:
    """Create a sample inventory movement for testing."""
    movement = MovimientoInventario(
        producto_id=sample_product.id,
        tipo=MovementTypeEnum.ENTRADA,
        cantidad=50,
        motivo="Stock inicial",
        fecha_hora=datetime.utcnow(),
        usuario="test_user",
        stock_resultante=150
    )
    db.add(movement)
    db.commit()
    db.refresh(movement)
    return movement
