import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const bookingController = new BookingController();

// protected routes
router.get('/bookings', authMiddleware, bookingController.getAllBookings);
router.get('/bookings/:id', authMiddleware, bookingController.getBookingById);
router.post('/bookings', authMiddleware, bookingController.createBooking);
router.put('/bookings/:id/cancel', authMiddleware, bookingController.cancelBooking);

export default router;

