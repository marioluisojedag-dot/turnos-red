import { z } from 'zod';

export const turnoSchema = z.object({
  paciente: z.string().min(1),
  documento: z.string().min(1),
  especialidad: z.enum([
    'Clínica médica',
    'Pediatría',
    'Odontología',
    'Nutrición',
  ]),
  medicoId: z.union([
    z.number().int().positive(),
    z.string().min(1),
  ]),
  id: z.union([
    z.number().int().positive(),
    z.string().min(1),
  ]),
  fecha: z.string().regex(
    /^\d{2}\/\d{2}\/\d{4}$/,
    'La fecha debe tener el formato DD/MM/YYYY',
  ),
  hora: z.string().regex(
    /^\d{2}([:.])\d{2}$/,
    'La hora debe tener el formato HH:MM o HH.MM',
  ),
  confirmado: z.union([
    z.boolean(),
    z.enum(['si', 'no']),
  ]),
});