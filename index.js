// app.js
import app from "./src/app.js";
import "./src/database.js";
import { PORT } from "./src/config.js";
import "./src/libs/initialSetup.js";
import http from 'http';
import { Server } from 'socket.io';

// Crear el servidor HTTP
const server = http.createServer(app);

// Crear una instancia de Socket.IO y asociarla al servidor HTTP
const io = new Server(server, {
  cors: {
    origin: "*", // Permite solicitudes de cualquier origen
    methods: ["GET", "POST"]
  }
});

// Escuchar el puerto
server.listen(PORT, () => {
  console.log("Server on port", PORT);
});

// Manejo de eventos de conexión y desconexión
io.on('connection', (socket) => {
    console.log('a user connected' + socket.id);
    socket.on('disconnect', () => {
      console.log('user disconnected' + socket.id);
    });
  
    // Manejo de mensajes del chat
    socket.on('chat-message', (msg) => {
      io.emit('chat-message', msg);
    });
  });
  
  // Exportar io para usarlo en otros archivos
  export { io };