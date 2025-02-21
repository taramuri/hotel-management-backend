import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  roomNumber: string;
  capacity: number;
  type: 'luxury' | 'semi-luxury' | 'standard';
  pricePerNight: number;
  isAvailable: boolean;
}

const RoomSchema: Schema = new Schema({
  roomNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['luxury', 'semi-luxury', 'standard']
  },
  pricePerNight: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IRoom>('Room', RoomSchema);