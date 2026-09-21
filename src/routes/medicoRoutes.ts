import { Router } from 'express';

import {
  getMedicos,
  getMedicoPorId,
  postMedico,
  putMedico,
  deleteMedico,
} from '../controllers/medicoController.js';

import { validateSchema } from '../middleware/validateSchema.js';
import { medicoSchema } from '../schemas/medicoSchema.js';

const router = Router();

 /**
  * @openapi
  * /medicos:
  *   get:
  *     summary: Obtener médicos
  *     description: Obtiene todos los médicos y permite filtrarlos opcionalmente por especialidad y disponibilidad.
  *     tags:
  *       - Médicos
  *     parameters:
  *       - in: query
  *         name: especialidad
  *         required: false
  *         description: Filtra los médicos por especialidad.
  *         schema:
  *           type: string
  *           enum:
  *             - Clínica médica
  *             - Pediatría
  *             - Odontología
  *             - Nutrición
  *         example: "Pediatría"
  *       - in: query
  *         name: disponible
  *         required: false
  *         description: Filtra los médicos según su disponibilidad.
  *         schema:
  *           type: boolean
  *         example: true
  *     responses:
  *       200:
  *         description: Lista de médicos obtenida correctamente.
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Medico'
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
router.get('/medicos', getMedicos);

/**
 * @openapi
 * /medicos/{id}:
 *   get:
 *     summary: Obtener un médico por ID
 *     description: Obtiene un médico específico utilizando su identificador.
 *     tags:
 *       - Médicos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único del médico.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Médico obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medico'
 *       400:
 *         description: El identificador proporcionado no es válido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Médico no encontrado.
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
router.get('/medicos/:id', getMedicoPorId);

/**
 * @openapi
 * /medicos:
 *   post:
 *     summary: Crear un médico
 *     description: Crea un nuevo médico después de validar los datos recibidos.
 *     tags:
 *       - Médicos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - nombre
 *               - especialidad
 *               - disponible
 *             properties:
 *               id:
 *                 oneOf:
 *                   - type: integer
 *                     minimum: 1
 *                   - type: string
 *                     minLength: 1
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 minLength: 1
 *                 example: "Dr. Carlos Pérez"
 *               especialidad:
 *                 type: string
 *                 enum:
 *                   - Clínica médica
 *                   - Pediatría
 *                   - Odontología
 *                   - Nutrición
 *                 example: "Clínica médica"
 *               disponible:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Médico creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medico'
 *       400:
 *         description: Datos del médico inválidos.
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
router.post('/medicos', validateSchema(medicoSchema), postMedico);

/**
 * @openapi
 * /medicos/{id}:
 *   put:
 *     summary: Actualizar un médico
 *     description: Actualiza los datos de un médico existente.
 *     tags:
 *       - Médicos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único del médico que se desea actualizar.
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
 *               - id
 *               - nombre
 *               - especialidad
 *               - disponible
 *             properties:
 *               id:
 *                 oneOf:
 *                   - type: integer
 *                     minimum: 1
 *                   - type: string
 *                     minLength: 1
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 minLength: 1
 *                 example: "Dr. Carlos Pérez"
 *               especialidad:
 *                 type: string
 *                 enum:
 *                   - Clínica médica
 *                   - Pediatría
 *                   - Odontología
 *                   - Nutrición
 *                 example: "Clínica médica"
 *               disponible:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Médico actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medico'
 *       400:
 *         description: Datos o identificador del médico inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Médico no encontrado.
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
router.put('/medicos/:id', validateSchema(medicoSchema), putMedico);

/**
 * @openapi
 * /medicos/{id}:
 *   delete:
 *     summary: Eliminar un médico
 *     description: Elimina un médico existente utilizando su identificador.
 *     tags:
 *       - Médicos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único del médico que se desea eliminar.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       204:
 *         description: Médico eliminado correctamente. La respuesta no contiene contenido.
 *       400:
 *         description: El identificador proporcionado no es válido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Médico no encontrado.
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
router.delete('/medicos/:id', deleteMedico);

export default router;