import { Medico, MedicoCrudo } from '../models/medico.js';

const medicos: Medico[] = [];

export function normalizarMedico(
  medicoCrudo: MedicoCrudo,
): Medico | null {
  const id = Number(medicoCrudo.id);
  const nombre = medicoCrudo.nombre.trim();
  const especialidad = medicoCrudo.especialidad.trim();

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  if (!nombre || !especialidad) {
    return null;
  }

  if (typeof medicoCrudo.disponible !== 'boolean') {
    return null;
  }

  return {
    id,
    nombre,
    especialidad,
    disponible: medicoCrudo.disponible,
  };
}

export function obtenerMedicos(
  especialidad?: string,
  disponible?: boolean,
): Medico[] {
  return medicos.filter((medico) => {
    if (
      especialidad &&
      medico.especialidad !== especialidad
    ) {
      return false;
    }

    if (
      disponible !== undefined &&
      medico.disponible !== disponible
    ) {
      return false;
    }

    return true;
  });
}

export function obtenerMedicoPorId(id: number): Medico | undefined {
  return medicos.find((medico) => medico.id === id);
}

export function crearMedico(
  medicoCrudo: MedicoCrudo,
): Medico | null {
  const medico = normalizarMedico(medicoCrudo);

  if (!medico) {
    return null;
  }

  medicos.push(medico);

  return medico;
}

export function actualizarMedico(
  id: number,
  datosCrudos: MedicoCrudo,
): Medico | null | undefined {
  const indice = medicos.findIndex((medico) => medico.id === id);

  if (indice === -1) {
    return undefined;
  }

  const medico = normalizarMedico(datosCrudos);

  if (!medico) {
    return null;
  }

  medicos[indice] = medico;

  return medicos[indice];
}

export function eliminarMedico(id: number): boolean {
  const indice = medicos.findIndex((medico) => medico.id === id);

  if (indice === -1) {
    return false;
  }

  medicos.splice(indice, 1);

  return true;
}


