export interface TurnoCrudo {
  id: string;
  paciente: string;
  documento: string | number;
  especialidad: string;
  medicoId: string | number;
  fecha: string;
  hora: string;
  confirmado: string | boolean;
  observaciones?: string;
}

export interface Turno {
  id: number;
  paciente: string;
  documento: string;
  especialidad: string;
  medicoId: number;
  fecha: string;
  hora: string;
  confirmado: boolean;
  observaciones?: string;
}