import mongoose from "mongoose";
import notesSchema from "../models/Notes.js";


export const getNotes = async (req, res) => {
    const collectionName = "notes";
  
    const Notes = mongoose.model("Notes", notesSchema, collectionName);
  
    try {
      const pageSize = 4;
      const notes = await Notes.find().sort({_id: -1}).limit(pageSize)
      return res.json(notes);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al obtener productos", error: error });
    }
  };