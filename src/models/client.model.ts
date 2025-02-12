import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String, required: true },
  passportData: { type: String, required: true, unique: true },
  comment: String,
  discountType: String,
  discountValue: Number
}, {
  timestamps: true
});

export const Client = mongoose.model('Client', clientSchema);