"""
Configuration module for Inventory Manager application.

Manages environment variables, database settings and application configuration.
"""

from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Inventory Manager"
    debug: bool = False
    api_version: str = "v1"

    database_url: str = "sqlite:///./inventory.db"
    sqlite_check_same_thread: bool = False

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    api_title: str = "Inventory Manager API"
    api_description: str = (
        "API REST para gestionar productos, categorías y movimientos de inventario "
        "con trazabilidad completa y alertas de stock bajo."
    )
    api_version_str: str = "1.0.0"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
