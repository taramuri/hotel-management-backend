import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';

const router = Router();
const clientController = new ClientController();

// public routes
router.get('/clients', clientController.getAllClients);
router.get('/clients/:id', clientController.getClientById);

// protected routes with role check
router.post('/clients', authMiddleware, roleMiddleware(['admin']), clientController.createClient);
router.put('/clients/:id', authMiddleware, roleMiddleware(['admin']), clientController.updateClient);
router.delete('/clients/:id', authMiddleware, roleMiddleware(['admin']), clientController.deleteClient);

export default router;
