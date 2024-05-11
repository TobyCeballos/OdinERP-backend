import { Router } from "express";
import {
  getNotes,
} from "../controllers/notes.controller.js";
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", verifyToken, getNotes);
export default router;
