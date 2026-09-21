import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TurnosRed API",
      version: "1.0.0",
      description: "API REST para la gestión de turnos médicos",
    },
    components: {
      schemas: {
        Turno: {
          type: 'object',
          required: [
            'id',
            'paciente',
            'documento',
            'especialidad',
            'medicoId',
            'fecha',
            'hora',
            'confirmado',
          ],
          properties: {
            id: {
              type: 'integer',
              description: 'Identificador único del turno.',
              example: 1,
            },
            paciente: {
              type: 'string',
              description: 'Nombre del paciente.',
              example: 'Juan Pérez',
            },
            documento: {
              type: 'string',
              description: 'Documento de identidad del paciente.',
              example: '12345678-9',
            },
            especialidad: {
              type: 'string',
              enum: [
                'Clínica médica',
                'Pediatría',
                'Odontología',
                'Nutrición',
              ],
              description: 'Especialidad médica del turno.',
              example: 'Clínica médica',
            },
            medicoId: {
              type: 'integer',
              description: 'Identificador del médico asignado.',
              example: 1,
            },
            fecha: {
              type: 'string',
              description: 'Fecha del turno en formato YYYY-MM-DD.',
              example: '2026-09-15',
            },
            hora: {
              type: 'string',
              description: 'Hora del turno en formato HH:MM.',
              example: '10:30',
            },
            confirmado: {
              type: 'boolean',
              description: 'Indica si el turno está confirmado.',
              example: true,
            },
            observaciones: {
              type: 'string',
              description: 'Observaciones adicionales del turno.',
              example: 'Paciente solicita atención prioritaria.',
            },
          },
        },

        ErrorResponse: {
          type: 'object',
          required: [
            'status',
            'message',
            'code',
            'details',
          ],
          properties: {
            status: {
              type: 'integer',
              description: 'Código HTTP del error.',
              example: 400,
            },
            message: {
              type: 'string',
              description: 'Mensaje descriptivo del error.',
              example: 'Error de validación en los datos ingresados',
            },
            code: {
              type: 'string',
              description: 'Código interno que identifica el tipo de error.',
              example: 'VALIDATION_ERROR',
            },
            details: {
              type: 'array',
              description: 'Información adicional relacionada con el error.',
              items: {},
              example: [],
            },
          },
        },

        Medico: {
          type: 'object',
          required: [
            'id',
            'nombre',
            'especialidad',
            'disponible',
          ],
          properties: {
            id: {
              type: 'integer',
              description: 'Identificador único del médico.',
              example: 1,
            },
            nombre: {
              type: 'string',
              description: 'Nombre del médico.',
              example: 'Dr. Carlos Pérez',
            },
            especialidad: {
              type: 'string',
              enum: [
                'Clínica médica',
                'Pediatría',
                'Odontología',
                'Nutrición',
              ],
              description: 'Especialidad médica del profesional.',
              example: 'Clínica médica',
            },
            disponible: {
              type: 'boolean',
              description: 'Indica si el médico está disponible.',
              example: true,
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;