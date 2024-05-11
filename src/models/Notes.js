import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  
  title: { type: String, required: true, unique:true },
  content: { type: String },
  date: { type: String }},
  {
    timestamps: true
  } 
);


export default notesSchema