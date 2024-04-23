import mongoose from "mongoose";

const userCollection = 'users';

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true
  },
  last_access: {
    type: Date
  },
  admission_date: {
    type: Date,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  user_state: {
    type: String,
    required: true
  },
  theme: {
    type: String
  },
  company_position: {
    type: String
  },
  department: {
    type: String
  },
  birthdate: {
    type: Date
  },
  skills: {
    type: [String]
  }
});


const UserModel = mongoose.model(userCollection, userSchema);

export default UserModel