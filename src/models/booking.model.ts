import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  client: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  isReservation: boolean;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  totalPrice: number;
  notes?: string;
}

const BookingSchema: Schema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  isReservation: { type: Boolean, default: false },
  status: { 
    type: String, 
    required: true,
    enum: ['confirmed', 'pending', 'cancelled', 'completed'],
    default: 'pending'
  },
  totalPrice: { type: Number, required: true },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model<IBooking>('Booking', BookingSchema);