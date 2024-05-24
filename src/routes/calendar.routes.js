import { Router } from 'express';
import { getEvents, saveEvent } from '../controllers/calendar.controller.js'; // Asegúrate de importar los controladores correctos
import { verifyToken } from '../middlewares/authJwt.js'; // Asegúrate de importar el middleware correcto

const router = Router();

// Ruta para obtener eventos
router.get('/:company/events', verifyToken, getEvents);

// Ruta para guardar un nuevo evento
router.post('/:company/event', verifyToken, saveEvent);

export default router;
