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

router.get('/medicos', getMedicos);

router.get('/medicos/:id', getMedicoPorId);

router.post('/medicos', validateSchema(medicoSchema), postMedico);

router.put('/medicos/:id', validateSchema(medicoSchema), putMedico);

router.delete('/medicos/:id', deleteMedico);

export default router;