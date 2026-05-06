"""
Database initialization and session management.

Configures SQLAlchemy connection, session factory and provides utilities
for database operations.
"""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from src.config import settings

# Create database engine
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": settings.sqlite_check_same_thread}
    if "sqlite" in settings.database_url
    else {},
    echo=False,
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()


def get_db() -> Session:
    """
    Dependency to get database session.
    
    Returns:
        Session: SQLAlchemy session for database operations.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create all tables defined in models."""
    Base.metadata.create_all(bind=engine)
