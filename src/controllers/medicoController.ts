import { Request, Response } from 'express';

import {
  obtenerMedicos,
  obtenerMedicoPorId,
  crearMedico,
  actualizarMedico,
  eliminarMedico,
} from '../services/medicoService.js';

import { ApiError } from '../middleware/apiError.js';

export function getMedicos(req: Request, res: Response): void {
  const especialidad =
    typeof req.query.especialidad === 'string'
      ? req.query.especialidad
      : undefined;

  const disponible =
    typeof req.query.disponible === 'string'
      ? req.query.disponible === 'true'
        ? true
        : req.query.disponible === 'false'
          ? false
          : undefined
      : undefined;

  const medicos = obtenerMedicos(especialidad, disponible);

  res.status(200).json(medicos);
}

export function getMedicoPorId(req: Request, res: Response): void {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(
      400,
      'El ID debe ser un número entero positivo',
      'VALIDATION_ERROR',
    );
  }

  const medico = obtenerMedicoPorId(id);

  if (!medico) {
    throw new ApiError(
      404,
      'Médico no encontrado',
      'NOT_FOUND',
    );
  }

  res.status(200).json(medico);
}

export function postMedico(req: Request, res: Response): void {
  const medico = crearMedico(req.body);

  res.status(201).json(medico);
}

export function putMedico(req: Request, res: Response): void {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(
      400,
      'El ID debe ser un número entero positivo',
      'VALIDATION_ERROR',
    );
  }

const medicoActualizado = actualizarMedico(id, req.body);

if (medicoActualizado === undefined) {
  throw new ApiError(
    404,
    'Médico no encontrado',
    'NOT_FOUND',
  );
}

if (medicoActualizado === null) {
  throw new ApiError(
    400,
    'Datos del médico inválidos',
    'VALIDATION_ERROR',
  );
}

res.status(200).json(medicoActualizado);
}

export function deleteMedico(req: Request, res: Response): void {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(
      400,
      'El ID debe ser un número entero positivo',
      'VALIDATION_ERROR',
    );
  }

  const eliminado = eliminarMedico(id);

  if (!eliminado) {
    throw new ApiError(
      404,
      'Médico no encontrado',
      'NOT_FOUND',
    );
  }

  res.status(204).json({
    mensaje: 'Médico eliminado correctamente',
  });
}

