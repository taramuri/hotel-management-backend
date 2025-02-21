import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  lastName: string;
  firstName: string;
  middleName: string;
  passportData: string;
  comment?: string;
  isRegular: boolean;
  discount?: number;
}

const ClientSchema: Schema = new Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String, required: true },
  passportData: { type: String, required: true, unique: true },
  comment: { type: String },
  isRegular: { type: Boolean, default: false },
  discount: { type: Number, min: 0, max: 100 }
}, { timestamps: true });

export default mongoose.model<IClient>('Client', ClientSchema);