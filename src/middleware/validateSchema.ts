import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateSchema(schema: ZodSchema) {
  return function (req: Request, _res: Response, next: NextFunction): void {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      next(resultado.error);
      return;
    }

    next();
  };
}