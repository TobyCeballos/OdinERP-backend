import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});



export default chatSchema;
