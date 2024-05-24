import mongoose from 'mongoose';

const { Schema } = mongoose;

const calendarEventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
});

export default calendarEventSchema;
