"""
Configuration module for Inventory Manager application.

Manages environment variables, database settings and application configuration.
"""

from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    app_name: str = "Inventory Manager"
    debug: bool = False
    api_version: str = "v1"

    # Database
    database_url: str = "sqlite:////app/data/inventory.db"
    
    # SQLite specific - useful for development
    sqlite_check_same_thread: bool = False

    # API
    api_title: str = "Inventory Manager API"
    api_description: str = (
        "API REST para gestionar productos, categorías y movimientos de inventario "
        "con trazabilidad completa y alertas de stock bajo."
    )
    api_version_str: str = "1.0.0"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
