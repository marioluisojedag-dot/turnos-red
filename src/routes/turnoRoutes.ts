import { Router } from 'express';

import {
  getTurnos,
  getTurnoPorId,
  postTurno,
  putTurno,
  deleteTurno,
} from '../controllers/turnoController.js';

import { validateSchema } from '../middleware/validateSchema.js';
import { turnoSchema } from '../schemas/turnoSchema.js';

const router = Router();

/**
 * @openapi
 * /turnos:
 *   get:
 *     summary: Obtener turnos
 *     description: Obtiene todos los turnos registrados y permite filtrarlos opcionalmente por especialidad, fecha y médico.
 *     tags:
 *       - Turnos
 *     parameters:
 *       - in: query
 *         name: especialidad
 *         required: false
 *         description: Filtra los turnos por especialidad médica.
 *         schema:
 *           type: string
 *           enum:
 *             - Clínica médica
 *             - Pediatría
 *             - Odontología
 *             - Nutrición
 *       - in: query
 *         name: fecha
 *         required: false
 *         description: Filtra los turnos por fecha en formato YYYY-MM-DD.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-09-15"
 *       - in: query
 *         name: medicoId
 *         required: false
 *         description: Filtra los turnos por el identificador del médico.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de turnos obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turno'
 *       400:
 *         description: Parámetros de consulta inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/turnos', getTurnos);

/**
  * @openapi
  * /turnos/{id}:
  *   get:
  *     summary: Obtener un turno por ID
  *     description: Obtiene un turno específico utilizando su identificador.
  *     tags:
  *       - Turnos
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         description: Identificador único del turno.
  *         schema:
  *           type: integer
  *           minimum: 1
  *         example: 1
  *     responses:
  *       200:
  *         description: Turno obtenido correctamente.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Turno'
  *       400:
  *         description: El identificador proporcionado no es válido.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/ErrorResponse'
  *       404:
  *         description: Turno no encontrado.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/ErrorResponse'
  *       500:
  *         description: Error interno del servidor.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/ErrorResponse'
  */
router.get('/turnos/:id', getTurnoPorId);

/**
 * @openapi
 * /turnos:
 *   post:
 *     summary: Crear un turno
 *     description: Crea un nuevo turno médico después de validar los datos recibidos.
 *     tags:
 *       - Turnos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paciente
 *               - documento
 *               - especialidad
 *               - medicoId
 *               - id
 *               - fecha
 *               - hora
 *               - confirmado
 *             properties:
 *               paciente:
 *                 type: string
 *                 example: "Juan Pérez"
 *               documento:
 *                 type: string
 *                 example: "12345678-9"
 *               especialidad:
 *                 type: string
 *                 enum:
 *                   - Clínica médica
 *                   - Pediatría
 *                   - Odontología
 *                   - Nutrición
 *                 example: "Clínica médica"
 *               medicoId:
 *                 oneOf:
 *                   - type: integer
 *                     minimum: 1
 *                   - type: string
 *                     minLength: 1
 *                 example: 1
 *               id:
 *                 oneOf:
 *                   - type: integer
 *                     minimum: 1
 *                   - type: string
 *                     minLength: 1
 *                 example: 10
 *               fecha:
 *                 type: string
 *                 pattern: '^\d{2}/\d{2}/\d{4}$'
 *                 example: "15/09/2026"
 *               hora:
 *                 type: string
 *                 pattern: '^\d{2}([:.])\d{2}$'
 *                 example: "10:30"
 *               confirmado:
 *                 oneOf:
 *                   - type: boolean
 *                   - type: string
 *                     enum:
 *                       - si
 *                       - no
 *                 example: true
 *               observaciones:
 *                 type: string
 *                 example: "Paciente solicita atención prioritaria."
 *     responses:
 *       201:
 *         description: Turno creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       400:
 *         description: Datos del turno inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/turnos', validateSchema(turnoSchema), postTurno);

 /**
  * @openapi
  * /turnos/{id}:
  *   put:
  *     summary: Actualizar un turno
  *     description: Actualiza los datos de un turno existente.
  *     tags:
  *       - Turnos
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         description: Identificador único del turno que se desea actualizar.
  *         schema:
  *           type: integer
  *           minimum: 1
  *         example: 1
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - paciente
  *               - documento
  *               - especialidad
  *               - medicoId
  *               - id
  *               - fecha
  *               - hora
  *               - confirmado
  *             properties:
  *               paciente:
  *                 type: string
  *                 example: "Juan Pérez"
  *               documento:
  *                 type: string
  *                 example: "12345678-9"
  *               especialidad:
  *                 type: string
  *                 enum:
  *                   - Clínica médica
  *                   - Pediatría
  *                   - Odontología
  *                   - Nutrición
  *                 example: "Clínica médica"
  *               medicoId:
  *                 oneOf:
  *                   - type: integer
  *                     minimum: 1
  *                   - type: string
  *                     minLength: 1
  *                 example: 1
  *               id:
  *                 oneOf:
  *                   - type: integer
  *                     minimum: 1
  *                   - type: string
  *                     minLength: 1
  *                 example: 10
  *               fecha:
  *                 type: string
  *                 pattern: '^\d{2}/\d{2}/\d{4}$'
  *                 example: "15/09/2026"
  *               hora:
  *                 type: string
  *                 pattern: '^\d{2}([:.])\d{2}$'
  *                 example: "10:30"
  *               confirmado:
  *                 oneOf:
  *                   - type: boolean
  *                   - type: string
  *                     enum:
  *                       - si
  *                       - no
  *                 example: true
  *               observaciones:
  *                 type: string
  *                 example: "Paciente solicita atención prioritaria."
  *     responses:
  *       200:
  *         description: Turno actualizado correctamente.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Turno'
  *       400:
  *         description: Datos o identificador del turno inválidos.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/ErrorResponse'
  *       404:
  *         description: Turno no encontrado.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/ErrorResponse'
  *       500:
  *         description: Error interno del servidor.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/ErrorResponse'
  */
router.put('/turnos/:id', validateSchema(turnoSchema), putTurno);

/**
 * @openapi
 * /turnos/{id}:
 *   delete:
 *     summary: Eliminar un turno
 *     description: Elimina un turno existente utilizando su identificador.
 *     tags:
 *       - Turnos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único del turno que se desea eliminar.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       204:
 *         description: Turno eliminado correctamente. La respuesta no contiene contenido.
 *       400:
 *         description: El identificador proporcionado no es válido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Turno no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/turnos/:id', deleteTurno);

export default router;
