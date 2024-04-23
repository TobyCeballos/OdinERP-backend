import { config } from "dotenv";
config();

export const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb+srv://tobyceballos:tobyceballos@cluster0.erpbj.mongodb.net/Cluster0?retryWrites=true&w=majority';
export const PORT = process.env.PORT || 4000;
export const SECRET = "07042022";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@localhost";
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";