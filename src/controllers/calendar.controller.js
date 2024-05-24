import calendarEventSchema from '../models/Calendar.js'; // Asegúrate de importar el modelo correcto
import mongoose from 'mongoose';
// Guardar un evento en la base de datos
export const saveEvent = async (req, res) => {
    const collectionName = req.params.company + "-calendar";
  
    const Calendar = mongoose.model("Calendar", calendarEventSchema, collectionName);
  try {
    const { title, description, start, end } = req.body;
    
    const newEvent = new Calendar({
      title,
      description,
      start,
      end,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).json({ message: 'Error saving event' });
  }
};

// Obtener todos los eventos del calendario
export const getEvents = async (req, res) => {
    const collectionName = req.params.company + "-calendar";
  
    const Calendar = mongoose.model("Calendar", calendarEventSchema, collectionName);
  try {
    const events = await Calendar.find();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).json({ message: 'Error retrieving events' });
  }
};
