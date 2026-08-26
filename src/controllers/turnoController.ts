import { Request, Response } from 'express';
import {
  obtenerTurnos,
  obtenerTurnoPorId,
  crearTurno,
  actualizarTurno,
  eliminarTurno,
} from '../services/turnoService.js';

export function getTurnos(req: Request, res: Response): void {
  const turnos = obtenerTurnos();

  res.status(200).json(turnos);
}

export function getTurnoPorId(req: Request, res: Response): void {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      error: 'El ID debe ser un número entero positivo',
    });
    return;
  }

  const turno = obtenerTurnoPorId(id);

  if (!turno) {
    res.status(404).json({
      error: 'Turno no encontrado',
    });
    return;
  }

  res.status(200).json(turno);
}

export function postTurno(req: Request, res: Response): void {
  const turno = req.body;

  if (!turno) {
    res.status(400).json({
      error: 'Datos del turno no proporcionados',
    });
    return;
  }

  const nuevoTurno = crearTurno(turno);

  if (!nuevoTurno) {
    res.status(400).json({
      error: 'Datos del turno inválidos',
    });
    return;
  }

  res.status(201).json(nuevoTurno);
}

export function putTurno(req: Request, res: Response): void {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      error: 'El ID debe ser un número entero positivo',
    });
    return;
  }

const turnoActualizado = actualizarTurno(id, req.body);

if (turnoActualizado === undefined) {
  res.status(404).json({
    error: 'Turno no encontrado',
  });
  return;
}

if (turnoActualizado === null) {
  res.status(400).json({
    error: 'Datos del turno inválidos',
  });
  return;
}

res.status(200).json(turnoActualizado);
}

export function deleteTurno(req: Request, res: Response): void {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      error: 'El ID debe ser un número entero positivo',
    });
    return;
  }

  const eliminado = eliminarTurno(id);

  if (!eliminado) {
    res.status(404).json({
      error: 'Turno no encontrado',
    });
    return;
  }

  res.status(200).json({
    mensaje: 'Turno eliminado correctamente',
  });
}
