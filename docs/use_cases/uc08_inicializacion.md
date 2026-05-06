# UC-08 – Inicialización del Sistema

## 1. Nombre del Caso de Uso
Inicialización del Sistema

## 2. Identificador
UC-08

## 3. Actor(es) Principal(es)
- Sistema (actor automático)
- Usuario Administrador (solo si se requiere inicialización manual opcional)

## 4. Descripción
Cuando el sistema se ejecuta por primera vez, debe verificar la existencia de la base de datos y los datos mínimos requeridos.  
Si no existen, el sistema realizará una inicialización automática que incluye:  
- Creación de tablas.  
- Inserción de datos base (categorías de ejemplo, productos de muestra opcionales).  
- Configuración inicial del sistema.

El objetivo es que el usuario pueda comenzar a utilizar el sistema sin configuraciones manuales.

## 5. Disparador
- Primera ejecución del sistema.
- Base de datos eliminada o vacía.
- Ejecución manual del comando de inicialización.

## 6. Precondiciones
- El sistema debe tener acceso de lectura y escritura al directorio donde se almacenará la base de datos.
- No debe existir una base de datos previamente inicializada **o** debe estar marcada como no válida.

## 7. Flujo Principal (Éxito)
1. El sistema se inicia.
2. El sistema verifica si existe la base de datos.
3. El sistema detecta que no existe o que está vacía.
4. El sistema crea la estructura de tablas definidas para:
   - Productos
   - Categorías
   - Movimientos de inventario
   - Configuración general
5. El sistema valida que todas las tablas se hayan creado correctamente.
6. El sistema inserta datos iniciales (si están habilitados):
   - Categorías base (por ejemplo: "General", "Sin categoría").
   - Productos de ejemplo opcionales.
7. El sistema registra en la tabla de configuración que la inicialización fue exitosa.
8. El sistema arranca en modo operativo normal.
9. El sistema muestra un mensaje (en CLI, logs, o interfaz):  
   **"Inicialización completada correctamente."**

## 8. Flujos Alternativos

### 8A – La base de datos ya existe
- 8A.1. El sistema detecta que la base de datos ya está inicializada.
- 8A.2. El sistema omite la creación e inserción de datos.
- 8A.3. El sistema inicia normalmente.

### 8B – Error al crear tablas
- 8B.1. Ocurre un error en la creación de una tabla.
- 8B.2. El sistema registra el error en logs.
- 8B.3. El sistema muestra:  
  *"Inicialización fallida. Consulte los registros."*
- 8B.4. El sistema se detiene o continúa en modo seguro (dependiendo de configuración).

### 8C – Error insertando datos iniciales
- 8C.1. El sistema crea las tablas pero falla al insertar datos.
- 8C.2. El sistema registra el error.
- 8C.3. El sistema continúa sin datos iniciales, pero con estructura válida.
- 8C.4. Muestra advertencia:  
  *"Inicialización incompleta: no se cargaron datos base."*

## 9. Postcondiciones
- El sistema queda completamente operativo.
- La base de datos existe y contiene la estructura mínima necesaria.
- (Opcional) Existen datos iniciales si no hubo errores y se configuró así.

## 10. Reglas de Negocio Asociadas
- **RN-08:** La inicialización debe ser automática sin intervención del usuario.
- **RN-09:** La inicialización debe ser idempotente: ejecutarla nuevamente no debe dañar datos existentes.
- **RN-10:** La versión del esquema debe registrarse para futuras migraciones.

## 11. Excepciones
- Permisos insuficientes en el sistema de archivos.
- Base de datos bloqueada por otro proceso.
- Errores inesperados en el motor de persistencia.

## 12. Prioridad
Alta

## 13. Frecuencia de Uso
Muy baja (solo la primera ejecución, mantenimiento o reinstalaciones).

## 14. Suposiciones
- El usuario acepta el dataset inicial por defecto.
- El sistema corre en un entorno limpio durante la primera instalación.