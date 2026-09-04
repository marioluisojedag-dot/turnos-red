import { z } from 'zod';

export const medicoSchema = z.object({
  id: z.union([
    z.number().int().positive(),
    z.string().min(1),
  ]),

  nombre: z.string().min(1),

  especialidad: z.enum([
    'Clínica médica',
    'Pediatría',
    'Odontología',
    'Nutrición',
  ]),

  disponible: z.boolean(),
});