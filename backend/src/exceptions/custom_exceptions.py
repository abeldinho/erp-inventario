"""
Custom exception classes for business logic validation.

These exceptions are caught by FastAPI exception handlers and converted
to appropriate HTTP responses.
"""


class InventoryException(Exception):
    """Base exception for all inventory-related errors."""
    
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class ResourceNotFoundError(InventoryException):
    """Raised when a requested resource does not exist."""
    
    def __init__(self, resource_type: str, resource_id: int = None):
        if resource_id:
            message = f"{resource_type} con ID {resource_id} no encontrado"
        else:
            message = f"{resource_type} no encontrado"
        super().__init__(message, status_code=404)


class DuplicateResourceError(InventoryException):
    """Raised when a unique constraint is violated."""
    
    def __init__(self, field: str, value: str):
        message = f"{field} '{value}' ya existe en el sistema"
        super().__init__(message, status_code=409)


class InvalidOperationError(InventoryException):
    """Raised when an operation cannot be performed due to invalid state."""
    
    def __init__(self, message: str):
        super().__init__(message, status_code=400)


class InsufficientStockError(InventoryException):
    """Raised when trying to remove more stock than available."""
    
    def __init__(self, product_name: str, available: int, requested: int):
        message = (
            f"Stock insuficiente para '{product_name}'. "
            f"Disponible: {available}, Solicitado: {requested}"
        )
        super().__init__(message, status_code=400)
