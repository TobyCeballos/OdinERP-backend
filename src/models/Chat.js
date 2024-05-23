import mongoose from 'mongoose';

// src/models/Chat.js

const chatSchema = new mongoose.Schema({
  id:{
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  }},
  {
    timestamps: true
  } 
);


export default chatSchema;
