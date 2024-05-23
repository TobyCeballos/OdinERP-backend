import mongoose from "mongoose";
import chatSchema from "../models/Chat.js";
// Guardar un mensaje en la base de datos
export const saveMessage = async (msg) => {
  const collectionName = msg.company + "-chats";

  const Chat = mongoose.model("Chat", chatSchema, collectionName);
  try {
    // Crear una instancia del modelo Chat con el mensaje
    const chatMessage = new Chat(msg);
    await chatMessage.save(); // Guardar el mensaje en la base de datos
    console.log('Message saved:', msg);
  } catch (error) {
    console.error('Error saving message:', error);
  }
};

// Obtener todos los mensajes del chat
export const getMessages = async (req, res) => {
    const collectionName = req.params.company + "-chats";
  
    const Chat = mongoose.model("Chat", chatSchema, collectionName);
  try {
    const messages = await Chat.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error });
  }
};
