import { readFile } from 'node:fs/promises';
import { TurnoCrudo } from '../models/turno.js';

export async function leerTurnos(ruta: string): Promise<TurnoCrudo[]> {
    try {
        const contenido = await readFile(ruta, 'utf-8');
        const datos = JSON.parse(contenido);

        if (!Array.isArray(datos)) {
            throw new Error('El archivo turnos.json debe contener un arreglo');
        }

        return datos;
    } catch (error) {
        console.error('Error al leer turnos.json:', error);
        return [];
    }
}

// Comparación:
// Con callbacks, node:fs utiliza una función que se ejecuta cuando termina
// la operación de lectura. Esto puede generar callbacks anidados cuando
// existen varias operaciones consecutivas.
//
// Con node:fs/promises y async/await, el código resulta más lineal y fácil
// de leer, además de permitir manejar los errores mediante try/catch.
