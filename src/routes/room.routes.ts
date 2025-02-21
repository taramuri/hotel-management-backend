import { Router } from 'express';
import { RoomController } from '../controllers/room.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const roomController = new RoomController();

// public routes
router.get('/rooms', roomController.getAllRooms);
router.get('/rooms/available', roomController.getAvailableRooms);
router.get('/rooms/:id', roomController.getRoomById);

// protected routes
router.post('/rooms', authMiddleware, roomController.createRoom);
router.put('/rooms/:id', authMiddleware, roomController.updateRoom);

export default router;