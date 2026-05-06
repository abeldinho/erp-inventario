# PROMPT: Domain Model

Con base en los FR, NFR y el Feature Brief:

1. Identifica todas las entidades del sistema.
2. Define atributos y tipos.
3. Define relaciones (1:1, 1:N, N:N).
4. Asegura consistencia con la API y DB a futuro.
5. Entregar también un diagrama simple en texto (ASCII).

Formato:

## Domain Model
### Entities
- **Product**
  - id: UUID
  - name: string
  - …

### Relationships
- Product 1:N Movements
…