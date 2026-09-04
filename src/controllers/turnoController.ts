import { Request, Response } from 'express';
import {
  obtenerTurnos,
  obtenerTurnoPorId,
  crearTurno,
  actualizarTurno,
  eliminarTurno,
} from '../services/turnoService.js';

import { ApiError } from '../middleware/apiError.js';

export function getTurnos(req: Request, res: Response): void {
  const turnos = obtenerTurnos();

  res.status(200).json(turnos);
}

export function getTurnoPorId(req: Request, res: Response): void {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(
      400,
      'El ID debe ser un número entero positivo',
      'VALIDATION_ERROR',
    );
  }

  const turno = obtenerTurnoPorId(id);

  if (!turno) {
    throw new ApiError(
      404,
      'Turno no encontrado',
      'NOT_FOUND',
    );
  }

  res.status(200).json(turno);
}

export function postTurno(req: Request, res: Response): void {
  const turno = req.body;

  if (!turno) {
    throw new ApiError(
      400,
      'Datos del turno no proporcionados',
      'VALIDATION_ERROR',
    );
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
    throw new ApiError(
      404,
      'Turno no encontrado',
      'NOT_FOUND',
    );
  }

  if (turnoActualizado === null) {
    throw new ApiError(
      400,
      'Datos del turno inválidos',
      'VALIDATION_ERROR',
    );
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
