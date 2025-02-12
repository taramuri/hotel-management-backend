import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['luxury', 'semi-luxury', 'standard']
  },
  pricePerNight: { type: Number, required: true },
  status: { 
    type: String,
    required: true,
    enum: ['available', 'occupied', 'reserved'],
    default: 'available'
  }
});

export const Room = mongoose.model('Room', roomSchema);