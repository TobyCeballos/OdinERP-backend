import { Router } from 'express';
import { getMessages } from '../controllers/chat.controller.js';
import {verifyToken } from "../middlewares/authJwt.js"
const router = Router();

router.get('/:company/messages',verifyToken, getMessages);

export default router;
