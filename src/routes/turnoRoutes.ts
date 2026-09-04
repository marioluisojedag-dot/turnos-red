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

router.get('/turnos', getTurnos);

router.get('/turnos/:id', getTurnoPorId);

router.post('/turnos', validateSchema(turnoSchema), postTurno);

router.put('/turnos/:id', validateSchema(turnoSchema), putTurno);

router.delete('/turnos/:id', deleteTurno);

export default router;
