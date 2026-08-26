# turnos-red

API REST para la gestión de turnos médicos, desarrollada con Node.js, TypeScript, Express y Socket.IO.

El proyecto recibe registros de turnos desde un archivo JSON, normaliza y valida los datos, descarta registros inválidos y permite gestionar los turnos mediante una API REST. Además, utiliza EventEmitter y Socket.IO para comunicar modificaciones en tiempo real.

## Requisitos previos

* Node.js LTS
* NVM (Node Version Manager)
* npm

La versión de Node.js utilizada por el proyecto está definida en el archivo `.nvmrc`.

## Instalación

Instalar o seleccionar la versión de Node.js indicada por el proyecto:

```bash
nvm use
```

Instalar las dependencias:

```bash
npm install
```

Crear el archivo `.env` utilizando `.env.example` como referencia.

Ejemplo:

```env
PORT=3000
DATA_FILE=./data/turnos.json
```

## Variables de entorno

| Variable    | Descripción                                   | Ejemplo              |
| ----------- | --------------------------------------------- | -------------------- |
| `PORT`      | Puerto utilizado por el servidor              | `3000`               |
| `DATA_FILE` | Ruta del archivo JSON que contiene los turnos | `./data/turnos.json` |

El archivo `.env` contiene la configuración local y no debe incluirse en el repositorio.

## Scripts y comandos disponibles

### Ejecutar ESLint

```bash
npm run lint
```

Analiza el código TypeScript y detecta problemas de estilo y posibles errores.

### Aplicar formato con Prettier

```bash
npm run format
```

Aplica el formato definido para el proyecto.

### Verificar TypeScript

```bash
npx tsc --noEmit
```

Comprueba que el código TypeScript compile correctamente sin generar archivos de salida.

### Ejecutar el servidor

```bash
npx tsx src/index.ts
```

Inicia el servidor Express y Socket.IO.

## Procesamiento de datos

Los registros se obtienen desde el archivo definido mediante `DATA_FILE`.

La lectura se realiza de forma asíncrona utilizando `node:fs/promises`, `async` y `await`.

Cada registro recibido es procesado mediante la función de normalización, que realiza conversiones y validaciones como:

* Conversión del `id` de texto a número.
* Conversión del `documento` a string.
* Eliminación de espacios innecesarios en el nombre del paciente.
* Limpieza de la especialidad.
* Estandarización de fecha y hora.
* Conversión del campo `confirmado` a booleano.
* Validación de fechas y horas.
* Validación de que el ID sea un número entero positivo.

Los registros que cumplen con la estructura esperada son aceptados y los que no cumplen las validaciones son rechazados.

Al iniciar el servidor se informa por consola la cantidad de registros aceptados y rechazados.

## API REST

### Obtener todos los turnos

```http
GET /turnos
```

Respuesta exitosa:

```text
200 OK
```

### Obtener un turno por ID

```http
GET /turnos/:id
```

Respuestas posibles:

```text
200 OK
400 Bad Request
404 Not Found
```

### Crear un turno

```http
POST /turnos
```

Respuesta exitosa:

```text
201 Created
```

### Actualizar un turno

```http
PUT /turnos/:id
```

Respuestas posibles:

```text
200 OK
400 Bad Request
404 Not Found
```

### Eliminar un turno

```http
DELETE /turnos/:id
```

Respuestas posibles:

```text
200 OK
400 Bad Request
404 Not Found
```

Los errores internos del servidor se responden mediante:

```text
500 Internal Server Error
```

## Eventos internos

El proyecto utiliza el módulo nativo `EventEmitter` de Node.js como bus de eventos interno.

Las operaciones exitosas generan los siguientes eventos:

| Operación        | Evento interno      |
| ---------------- | ------------------- |
| Crear turno      | `turno:creado`      |
| Actualizar turno | `turno:actualizado` |
| Eliminar turno   | `turno:eliminado`   |

Estos eventos permiten mantener desacoplada la lógica del servicio de la comunicación en tiempo real.

## Comunicación en tiempo real

Socket.IO está integrado con el servidor HTTP utilizado por Express.

Los eventos internos son retransmitidos a los clientes conectados mediante los siguientes eventos:

| Evento interno      | Evento Socket.IO    |
| ------------------- | ------------------- |
| `turno:creado`      | `turno:nuevo`       |
| `turno:actualizado` | `turno:actualizado` |
| `turno:eliminado`   | `turno:eliminado`   |

De esta forma, los clientes pueden recibir modificaciones de los turnos en tiempo real sin necesidad de realizar consultas periódicas mediante polling.

## Estructura del proyecto

```text
turnos-red/
├── data/
│   └── turnos.json
├── src/
│   ├── controllers/
│   │   └── turnoController.ts
│   ├── events/
│   │   └── eventBus.ts
│   ├── models/
│   │   └── turno.ts
│   ├── routes/
│   │   └── turnoRoutes.ts
│   ├── services/
│   │   └── turnoService.ts
│   ├── utils/
│   │   └── archivoService.ts
│   ├── index.ts
│   └── testSocket.ts
├── .env
├── .env.example
├── .gitignore
├── .nvmrc
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

### Responsabilidades de las carpetas

**`models/`**

Contiene las interfaces que representan los datos del sistema, incluyendo `TurnoCrudo` y `Turno`.

**`services/`**

Contiene la lógica de normalización, validación y operaciones CRUD de los turnos.

**`controllers/`**

Procesa las peticiones HTTP y genera las respuestas correspondientes.

**`routes/`**

Define los endpoints REST y los conecta con los controllers.

**`events/`**

Contiene el bus de eventos interno basado en `EventEmitter`.

**`utils/`**

Contiene las funciones auxiliares utilizadas para leer y procesar el archivo JSON.

**`data/`**

Contiene el archivo JSON utilizado como fuente inicial de datos.

**`index.ts`**

Configura Express, el servidor HTTP, Socket.IO, las variables de entorno, las rutas y los eventos internos.

**`testSocket.ts`**

Cliente utilizado durante el desarrollo para comprobar la recepción de eventos mediante Socket.IO.

## Tecnologías utilizadas

* Node.js
* TypeScript
* Express
* Socket.IO
* dotenv
* ESLint
* Prettier
* npm

## Arquitectura general

```text
turnos.json
     │
     ▼
archivoService
     │
     ▼
normalizarTurno
     │
     ▼
turnos válidos
     │
     ▼
turnoService
     │
     ├───────────────┐
     ▼               ▼
Express REST     EventEmitter
     │               │
     │               ▼
     │           Socket.IO
     │               │
     ▼               ▼
  Cliente       Clientes conectados
```

La arquitectura separa la lectura y normalización de datos, la lógica de negocio, el manejo de peticiones HTTP y la comunicación en tiempo real.
