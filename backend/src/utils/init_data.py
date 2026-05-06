"""
Initialize sample data for development and testing.

Creates sample categories and products for demonstration purposes.
Only creates data if the database is empty.
"""

from sqlalchemy.orm import Session
from src.models import Category, Producto, ConfiguracionSistema
from datetime import datetime


def init_sample_data(db: Session) -> None:
    """
    Initialize database with sample data for development.
    
    Creates:
    - Sample categories
    - Sample products
    - System configuration
    
    Only executes if database is empty (no categories exist).
    
    Args:
        db: Database session.
    """
    # Check if data already exists
    existing_categories = db.query(Category).count()
    if existing_categories > 0:
        print("Database already contains data. Skipping initialization.")
        return
    
    try:
        # Create sample categories
        categories_data = [
            {
                "nombre": "Electrónica",
                "descripcion": "Productos electrónicos y accesorios"
            },
            {
                "nombre": "Ropa",
                "descripcion": "Prendas de vestir y accesorios de moda"
            },
            {
                "nombre": "Alimentos",
                "descripcion": "Productos alimenticios y bebidas"
            },
            {
                "nombre": "Oficina",
                "descripcion": "Útiles y equipos de oficina"
            },
        ]
        
        categories = []
        for cat_data in categories_data:
            category = Category(
                nombre=cat_data["nombre"],
                descripcion=cat_data["descripcion"],
                activo=True,
                created_at=datetime.utcnow()
            )
            categories.append(category)
            db.add(category)
        
        db.flush()  # Get IDs without committing
        
        # Create sample products
        products_data = [
            {
                "nombre": "Laptop Dell XPS 15",
                "descripcion": "Laptop de alta gama para profesionales",
                "sku": "DELL-XPS15-2024",
                "categoria_id": categories[0].id,
                "precio": 1299.99,
                "stock_inicial": 10,
                "stock_minimo": 2
            },
            {
                "nombre": "Mouse inalámbrico Logitech",
                "descripcion": "Mouse inalámbrico de precisión",
                "sku": "LOG-MOUSE-001",
                "categoria_id": categories[0].id,
                "precio": 29.99,
                "stock_inicial": 50,
                "stock_minimo": 10
            },
            {
                "nombre": "Camiseta de algodón",
                "descripcion": "Camiseta 100% algodón premium",
                "sku": "SHIRT-COTTON-M",
                "categoria_id": categories[1].id,
                "precio": 19.99,
                "stock_inicial": 100,
                "stock_minimo": 20
            },
            {
                "nombre": "Jeans azul oscuro",
                "descripcion": "Jeans clásico azul oscuro talla estándar",
                "sku": "JEANS-BLUE-32",
                "categoria_id": categories[1].id,
                "precio": 49.99,
                "stock_inicial": 75,
                "stock_minimo": 15
            },
            {
                "nombre": "Café molido 500g",
                "descripcion": "Café colombiano de alta calidad",
                "sku": "COFFEE-COLOM-500",
                "categoria_id": categories[2].id,
                "precio": 8.99,
                "stock_inicial": 200,
                "stock_minimo": 40
            },
            {
                "nombre": "Agua embotellada 1L",
                "descripcion": "Agua mineral natural",
                "sku": "WATER-1L-PACK",
                "categoria_id": categories[2].id,
                "precio": 1.99,
                "stock_inicial": 500,
                "stock_minimo": 100
            },
            {
                "nombre": "Libreta tamaño A4",
                "descripcion": "Libreta con 100 hojas rayadas",
                "sku": "NOTEBOOK-A4-100",
                "categoria_id": categories[3].id,
                "precio": 5.99,
                "stock_inicial": 150,
                "stock_minimo": 30
            },
            {
                "nombre": "Bolígrafos pack 12",
                "descripcion": "Pack de 12 bolígrafos azules",
                "sku": "PENS-BLUE-12",
                "categoria_id": categories[3].id,
                "precio": 3.99,
                "stock_inicial": 200,
                "stock_minimo": 50
            },
        ]
        
        for prod_data in products_data:
            product = Producto(
                nombre=prod_data["nombre"],
                descripcion=prod_data["descripcion"],
                sku=prod_data["sku"],
                categoria_id=prod_data["categoria_id"],
                precio=prod_data["precio"],
                stock_actual=prod_data["stock_inicial"],
                stock_minimo=prod_data["stock_minimo"],
                activo=True,
                created_at=datetime.utcnow()
            )
            db.add(product)
        
        # Create system configuration
        config = ConfiguracionSistema(
            clave="db_version",
            valor="1.0.0"
        )
        db.add(config)
        
        # Commit all changes
        db.commit()
        print("✓ Sample data initialized successfully")
        print(f"  - {len(categories)} categories created")
        print(f"  - {len(products_data)} products created")
        
    except Exception as e:
        db.rollback()
        print(f"✗ Error initializing sample data: {str(e)}")
        raise
