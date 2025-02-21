import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const clientController = new ClientController();

// public routes
router.get('/clients', clientController.getAllClients);
router.get('/clients/:id', clientController.getClientById);

// protected routes
router.post('/clients', authMiddleware, clientController.createClient);
router.put('/clients/:id', authMiddleware, clientController.updateClient);
router.delete('/clients/:id', authMiddleware, clientController.deleteClient);

export default router;