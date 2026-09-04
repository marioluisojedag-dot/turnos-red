import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from './apiError.js';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof ApiError) {
    res.status(error.status).json({
      status: error.status,
      message: error.message,
      code: error.code,
      details: error.details,
    });

    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      status: 400,
      message: 'Error de validación en los datos ingresados',
      code: 'VALIDATION_ERROR',
      details: error.issues,
    });

    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Error interno del servidor',
    code: 'INTERNAL_SERVER_ERROR',
    details: [],
  });
}