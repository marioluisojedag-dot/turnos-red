# ADR-002: Adopción futura de JWT para autenticación y autorización

- **Fecha:** 2026-09-18
- **Estado:** Propuesto

## Contexto

Actualmente la API `turnos-red` no implementa autenticación ni autorización. Los endpoints REST pueden ser utilizados sin proporcionar credenciales y no existe un mecanismo para identificar a los usuarios que realizan las operaciones.

A medida que la aplicación evolucione, puede ser necesario controlar el acceso a los recursos y diferenciar los permisos de distintos tipos de usuarios, por ejemplo pacientes, médicos y administradores.

## Decisión

Se propone evaluar la adopción futura de **JSON Web Tokens (JWT)** como mecanismo de autenticación para la API.

La implementación de JWT no forma parte del alcance actual del proyecto. Si se incorpora posteriormente, los tokens podrían utilizarse para identificar al usuario autenticado y transmitir información necesaria para aplicar reglas de autorización.

La autenticación y autorización se implementarían mediante middleware, manteniendo separada esta responsabilidad de los controllers y services existentes.

## Consecuencias

### Positivas

- Permitiría identificar a los usuarios que realizan solicitudes.
- Facilitaría la protección de endpoints que requieran autenticación.
- Permitiría implementar diferentes niveles de autorización.
- Mantendría la autenticación separada de la lógica de negocio mediante middleware.
- JWT es compatible con arquitecturas basadas en APIs REST.

### Negativas

- Aumentaría la complejidad del proyecto.
- Sería necesario implementar gestión de usuarios y credenciales.
- Se deberían definir políticas para expiración, renovación y almacenamiento seguro de tokens.
- Los endpoints protegidos requerirían mecanismos adicionales de prueba y documentación.
- Un error en la gestión de tokens podría generar problemas de seguridad.

## Alternativas consideradas

### Mantener la API sin autenticación

Es la situación actual y resulta suficiente para el alcance educativo y funcional de la versión presente, pero no permitiría controlar el acceso a recursos protegidos.

### Sesiones tradicionales

Las sesiones podrían utilizarse para mantener el estado de autenticación, pero agregarían una dependencia del estado almacenado en el servidor y no serían necesarias para el alcance actual de la API REST.

### API Keys

Las API Keys podrían utilizarse para identificar aplicaciones o clientes, pero no proporcionan por sí solas un modelo completo de autenticación y autorización de usuarios.

## Limitaciones

La adopción de JWT no resolvería por sí sola todos los aspectos de seguridad de la aplicación.

Una futura implementación debería considerar, entre otros aspectos, la protección de las credenciales, la firma y validación de tokens, su expiración, la gestión de permisos y el almacenamiento seguro de información sensible.

## Impacto

La adopción futura de JWT implicaría incorporar nuevos componentes de autenticación y autorización sin modificar necesariamente la separación actual entre rutas, middleware, controllers y services.

Antes de implementarlo sería necesario definir los roles de usuario, los endpoints que requieren protección y las reglas de acceso correspondientes.