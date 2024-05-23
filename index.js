// app.js
import app from "./src/app.js";
import "./src/database.js";
import { PORT } from "./src/config.js";
import "./src/libs/initialSetup.js";
import http from "http";
import { Server } from "socket.io";
import { saveMessage } from "./src/controllers/chat.controller.js";

// Crear el servidor HTTP
const server = http.createServer(app);

// Crear una instancia de Socket.IO y asociarla al servidor HTTP
const io = new Server(server, {
  cors: {
    origin: "*", // Permite solicitudes de cualquier origen
    methods: ["GET", "POST"],
  },
});

// Escuchar el puerto
server.listen(PORT, () => {
  console.log("Server on port", PORT);
});

// Manejo de eventos de conexión y desconexión
io.on("connection", (socket) => {
  console.log("a user connected" + socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected" + socket.id);
  });

  // Manejo de mensajes del chat
  socket.on("chat-message", async (msg) => {
    try {
      await saveMessage(msg); // Guardar el mensaje en la base de datos
      io.emit("chat-message", msg); // Emitir el mensaje a todos los clientes
    } catch (error) {
      console.error("Error handling chat message:", error);
    }
  });
  // Manejo del estado de escritura
  socket.on("typing", (username) => {
    socket.broadcast.emit("typing", username); // Transmitir el nombre de usuario a todos los clientes excepto al que está escribiendo
  });

  socket.on("stop-typing", (username) => {
    socket.broadcast.emit("stop-typing", username); // Transmitir el nombre de usuario a todos los clientes excepto al que dejó de escribir
  });
});

export { io };
