import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import clientRoutes from './routes/client.routes';
import roomRoutes from './routes/room.routes';
import bookingRoutes from './routes/booking.routes';
import authRoutes from './routes/auth.routes'; 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hotel Management API' });
});

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api', clientRoutes);
app.use('/api', roomRoutes);
app.use('/api', bookingRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error occurred!' });
});

// connect
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-management')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});