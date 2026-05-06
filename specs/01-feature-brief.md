# Feature Brief — Inventory Manager (v1.0)

## 1. Descripción General

Inventory Manager es una aplicación web ligera diseñada para permitir que un usuario gestione productos y su inventario asociado. El sistema permite registrar productos, clasificarlos en categorías y mantener un historial claro de entradas y salidas de stock.

El objetivo principal es ofrecer una herramienta simple, rápida y accesible para monitorear existencias sin necesidad de soluciones complejas o costosas.

Este proyecto sigue la metodología **Spec-Driven Development (SDD)** para asegurar consistencia, mantenibilidad y trazabilidad durante todo el ciclo de desarrollo.

---

## 2. Problema a Resolver

Personas o pequeños negocios necesitan saber:

- qué productos tienen,
- cuánto stock hay disponible,
- cuándo ocurrió cada movimiento,
- si deben reponer inventario.

Actualmente lo llevan en Excel u hojas sueltas. Se necesita una solución sencilla pero confiable.

---

## 3. Objetivos del Sistema

- Registrar productos y categorías.
- Ver el stock actual.
- Registrar movimientos de entrada/salida.
- Consultar un historial de movimientos.
- Obtener alertas de stock bajo (simple).

---

## 4. Perfil del Usuario

- Usuario único (no hay roles en esta versión).
- Persona que necesita controlar inventario básico sin complicaciones.
- No requiere conocimientos técnicos.

---

## 5. Alcance (Scope)

### ✔ Incluido
- CRUD de productos
- CRUD de categorías
- Movimientos de inventario (entrada/salida)
- Cálculo automático del stock
- Historial filtrable
- Alerta simple por stock mínimo
- API REST completa para frontend
- Base de datos SQLite (desarrollo) / PostgreSQL (producción)

### ❌ No incluido (para mantenerlo pequeño)
- Usuarios y roles
- Multi-bodega
- Flujos avanzados de compra/venta
- Reportes avanzados
- Integraciones externas

---

## 6. Tecnologías Definidas
- Backend: **FastAPI (Python)**
- DB: **SQLite** (local) / **PostgreSQL gratuito** (deployment)
- Frontend: **React**
- Infraestructura gratuita (Railway / Render)

---

## 7. Definición de Éxito
El sistema se considera exitoso cuando:

- Permite registrar y consultar productos.
- Calcula stock correctamente.
- Permite registrar movimientos.
- Proporciona un historial claro.
- Funciona en un servidor gratuito accesible públicamente.

---