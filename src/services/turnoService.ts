import { Turno, TurnoCrudo } from '../models/turno.js';
import { eventBus } from '../events/eventBus.js';

export function normalizarTurno(turnoCrudo: TurnoCrudo): Turno | null {
  const id = Number(turnoCrudo.id);
  const paciente = turnoCrudo.paciente.trim();
  const documento = String(turnoCrudo.documento);
  const especialidadTexto = turnoCrudo.especialidad.trim().toUpperCase();

  const especialidades: Record<string, string> = {
    'CLÍNICA MÉDICA': 'Clínica médica',
    'PEDIATRÍA': 'Pediatría',
    'ODONTOLOGÍA': 'Odontología',
    'NUTRICIÓN': 'Nutrición',
  };

  const especialidad = especialidades[especialidadTexto];
  const medicoId = Number(turnoCrudo.medicoId);

  //id
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  if (!Number.isInteger(medicoId) || medicoId <= 0) {
  return null;
  }

  //paciente, documento, especialidad
  if (!paciente || !documento || !especialidad) {
    return null;
  }

  //fecha
  const [dia, mes, año] = turnoCrudo.fecha.split('/');

  const diaNumero = Number(dia);
  const mesNumero = Number(mes);
  const añoNumero = Number(año);

  if (
    diaNumero <= 0 ||
    diaNumero > 31 ||
    mesNumero <= 0 ||
    mesNumero > 12 ||
    añoNumero <= 0
  ) {
    return null;
  }

  const fechaDate = new Date(añoNumero, mesNumero - 1, diaNumero);

  if (
    fechaDate.getFullYear() !== añoNumero ||
    fechaDate.getMonth() !== mesNumero - 1 ||
    fechaDate.getDate() !== diaNumero
  ) {
    return null;
  }

  const fecha = `${año}-${mes}-${dia}`;
  //fecha

  //hora
  const hora = turnoCrudo.hora.replace('.', ':');
  const [horaParte, minutoParte] = hora.split(':');
  const horaNumero = Number(horaParte);
  const minutoNumero = Number(minutoParte);

  if (
    !Number.isInteger(horaNumero) ||
    !Number.isInteger(minutoNumero) ||
    horaNumero < 0 ||
    horaNumero > 23 ||
    minutoNumero < 0 ||
    minutoNumero > 59
  ) {
    return null;
  }
  //hora

  //confirmado
  let confirmado: boolean;

  if (typeof turnoCrudo.confirmado === 'boolean') {
    confirmado = turnoCrudo.confirmado;
  } else {
    const confirmadoTexto = turnoCrudo.confirmado.trim().toLowerCase();
    if (confirmadoTexto === 'si') {
      confirmado = true;
    } else if (confirmadoTexto === 'no') {
      confirmado = false;
    } else return null;
  }
  //confirmado

  //turno entregado
  const turno: Turno = {
    id: id,
    paciente: paciente,
    documento: documento,
    especialidad: especialidad,
    medicoId: medicoId,
    fecha: fecha,
    hora: hora,
    confirmado: confirmado,
  };

  return turno;
}

const turnos: Turno[] = [];

export function obtenerTurnos(
  especialidad?: string,
  fecha?: string,
  medicoId?: number
): Turno[] {
  return turnos.filter((turno) => {
    if (especialidad && turno.especialidad !== especialidad) {
      return false;
    }

    if (fecha && turno.fecha !== fecha) {
      return false;
    }

    if (medicoId !== undefined && turno.medicoId !== medicoId) {
      return false;
    }

    return true;
  });
}

export function obtenerTurnoPorId(id: number): Turno | undefined {
  return turnos.find((turno) => turno.id === id);
}

export function crearTurno(turnoCrudo: TurnoCrudo): Turno | null {
  const turno = normalizarTurno(turnoCrudo);

  if (!turno) {
    return null;
  }

  turnos.push(turno);
  eventBus.emit('turno:creado', turno);
  return turno;
}

export function actualizarTurno(
  id: number,
  datosCrudos: TurnoCrudo
): Turno | null | undefined {
  const indice = turnos.findIndex((turno) => turno.id === id);

  if (indice === -1) {
    return undefined;
  }

  const datos = normalizarTurno(datosCrudos);

  if (!datos) {
    return null;
  }

  turnos[indice] = datos;
  eventBus.emit('turno:actualizado', turnos[indice]);
  return turnos[indice];
}

export function eliminarTurno(id: number): boolean {
  const indice = turnos.findIndex((turno) => turno.id === id);

  if (indice === -1) {
    return false;
  }

  const turnoEliminado = turnos[indice];

  turnos.splice(indice, 1);

  eventBus.emit('turno:eliminado', turnoEliminado);

  return true;
}

export function cargarTurnos(turnosIniciales: Turno[]): void {
    turnos.push(...turnosIniciales);
}
