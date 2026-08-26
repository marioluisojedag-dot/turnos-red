import { Router } from 'express';
import {
  getTurnos,
  getTurnoPorId,
  postTurno,
  putTurno,
  deleteTurno,
} from '../controllers/turnoController.js';

const router = Router();

router.get('/turnos', getTurnos);
router.get('/turnos/:id', getTurnoPorId);
router.post('/turnos', postTurno);
router.put('/turnos/:id', putTurno);
router.delete('/turnos/:id', deleteTurno);

export default router;
