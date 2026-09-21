import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import turnoRoutes from './routes/turnoRoutes.js';
import { eventBus } from './events/eventBus.js';
import { leerTurnos } from './utils/archivoService.js';
import { cargarTurnos, normalizarTurno } from './services/turnoService.js';
import { errorHandler } from './middleware/errorHandler.js';
import medicoRoutes from './routes/medicoRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';


dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = process.env.DATA_FILE || './data/turnos.json';

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(turnoRoutes);

app.use(medicoRoutes);

app.use(errorHandler);

eventBus.on('turno:creado', (turno) => {
  io.emit('turno:nuevo', turno);
});

eventBus.on('turno:actualizado', (turno) => {
  io.emit('turno:actualizado', turno);
});

eventBus.on('turno:eliminado', (turno) => {
  io.emit('turno:eliminado', turno);
});

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

async function iniciarServidor(): Promise<void> {
  const registros = await leerTurnos(DATA_FILE);

  const turnosValidos = [];
  let rechazados = 0;

  for (const registro of registros) {
    const turno = normalizarTurno(registro);

    if (turno) {
      turnosValidos.push(turno);
    } else {
      rechazados++;
    }
  }

  cargarTurnos(turnosValidos);

  console.log(`Registros aceptados: ${turnosValidos.length}`);
  console.log(`Registros rechazados: ${rechazados}`);

  httpServer.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  });
}

iniciarServidor();

