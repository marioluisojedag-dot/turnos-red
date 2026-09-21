# ADR-001: Uso de OpenAPI para la documentación de la API

- **Fecha:** 2026-09-18
- **Estado:** Aceptado

## Contexto

El proyecto `turnos-red` expone una API REST para la gestión de turnos médicos y médicos. La API cuenta con múltiples endpoints, parámetros de consulta, cuerpos de petición, códigos de respuesta y estructuras de datos que deben mantenerse documentados de forma coherente con la implementación.

Inicialmente, la documentación se encontraba principalmente en el README y en la colección de Postman. Debido al crecimiento de la API, se requiere un estándar que permita describir formalmente los endpoints y facilite su consulta y prueba.

## Decisión

Se adopta **OpenAPI 3.0** como estándar oficial para la documentación de la API REST del proyecto.

La especificación se genera mediante `swagger-jsdoc` a partir de la documentación JSDoc incorporada en las rutas de Express y se expone mediante `swagger-ui-express` en:

`/api-docs`

La especificación incluye los endpoints de turnos y médicos, parámetros de consulta, parámetros de ruta, cuerpos de petición, respuestas HTTP y esquemas reutilizables como `Turno`, `Medico` y `ErrorResponse`.

## Consecuencias

### Positivas

- La API dispone de una documentación interactiva accesible desde `/api-docs`.
- Los endpoints quedan documentados de manera estructurada.
- Los esquemas reutilizables reducen la duplicación en la documentación.
- Swagger UI permite consultar y probar los endpoints desde una interfaz gráfica.
- Facilita la comparación entre la implementación, los esquemas Zod y las pruebas realizadas con Postman.
- La especificación puede utilizarse posteriormente para generar documentación o herramientas compatibles con OpenAPI.

### Negativas

- Es necesario mantener actualizados los comentarios JSDoc cuando cambie la API.
- Existe el riesgo de que la documentación se desactualice si se modifica el backend sin actualizar la especificación.

## Alternativas consideradas

### Mantener únicamente la documentación del README

Fue descartada porque el README no proporciona una especificación estructurada ni una interfaz interactiva para consultar los endpoints.

### Utilizar únicamente Postman

Fue descartada porque Postman permite realizar pruebas y organizar solicitudes, pero no reemplaza una especificación formal de la API.

### Documentar manualmente en un documento separado

Fue descartada porque aumenta la posibilidad de divergencia entre la documentación y el código fuente.

## Limitaciones

OpenAPI documenta el contrato esperado de la API, pero no garantiza por sí mismo que la implementación cumpla siempre con dicho contrato.

Por este motivo, la especificación debe mantenerse sincronizada con Express, Zod y Postman, y se recomienda incorporar pruebas de contrato automatizadas en el futuro.

## Impacto

La adopción de OpenAPI establece una fuente formal de documentación para la API y facilita su mantenimiento, revisión y evolución.

La documentación queda integrada al código mediante JSDoc y forma parte del repositorio, permitiendo aplicar el enfoque de **Docs as Code**.