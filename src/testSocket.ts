import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Cliente conectado al servidor:', socket.id);
});

socket.on('turno:nuevo', (turno) => {
  console.log('Nuevo turno recibido:', turno);
});

socket.on('turno:actualizado', (turno) => {
  console.log('Turno actualizado:', turno);
});

socket.on('turno:eliminado', (turno) => {
  console.log('Turno eliminado:', turno);
});
