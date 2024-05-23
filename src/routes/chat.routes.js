import { Router } from 'express';
import { getMessages, saveMessage } from '../controllers/chat.controller.js';
import {verifyToken } from "../middlewares/authJwt.js"
const router = Router();

router.get('/:company/messages',verifyToken, getMessages);
router.post('/:company/messages',verifyToken, saveMessage);

export default router;
