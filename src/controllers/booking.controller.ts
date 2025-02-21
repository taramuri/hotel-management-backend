import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import Booking, { IBooking } from '../models/booking.model';
import Room, { IRoom } from '../models/room.model';
import Client, { IClient } from '../models/client.model';

interface CreateBookingRequest {
  clientId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  isReservation?: boolean;
  notes?: string;
}

export class BookingController {
  public async createBooking(
    req: Request<{}, {}, CreateBookingRequest>,
    res: Response
  ): Promise<void> {
    try {
      const client = await Client.findById(req.body.clientId).exec();
      const room = await Room.findById(req.body.roomId).exec();

      if (!client || !room) {
        res.status(404).json({ message: 'Client or room not found' });
        return;
      }

      const isRoomAvailable = await this.checkRoomAvailability(
        req.body.roomId,
        new Date(req.body.checkInDate),
        new Date(req.body.checkOutDate)
      );

      if (!isRoomAvailable) {
        res.status(400).json({ message: 'Room is unavailable for the selected dates' });
        return;
      }

      const totalPrice = this.calculateTotalPrice(
        room.pricePerNight,
        new Date(req.body.checkInDate),
        new Date(req.body.checkOutDate),
        client.discount || 0
      );

      const newBooking = new Booking({
        client: new Types.ObjectId(client.id),
        room: new Types.ObjectId(room.id),
        checkInDate: new Date(req.body.checkInDate),
        checkOutDate: new Date(req.body.checkOutDate),
        isReservation: req.body.isReservation || false,
        status: 'confirmed',
        totalPrice,
        notes: req.body.notes
      });

      const savedBooking = await newBooking.save();
      res.status(201).json(savedBooking);
    } catch (error) {
      res.status(400).json({ message: 'Error while creating booking', error });
    }
  }

  private async checkRoomAvailability(
    roomId: string,
    checkIn: Date,
    checkOut: Date
  ): Promise<boolean> {
    const conflictingBookings = await Booking.find({
      room: new Types.ObjectId(roomId),
      status: { $nin: ['cancelled'] },
      $or: [
        { checkInDate: { $lte: checkOut }, checkOutDate: { $gte: checkIn } }
      ]
    }).exec();

    return conflictingBookings.length === 0;
  }

  private calculateTotalPrice(
    pricePerNight: number,
    checkIn: Date,
    checkOut: Date,
    discount: number
  ): number {
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    const basePrice = pricePerNight * nights;
    return basePrice * (1 - discount / 100);
  }

  public async getAllBookings(req: Request, res: Response): Promise<void> {
    try {
      const bookings = await Booking.find()
        .populate('client', 'firstName lastName email')
        .populate('room', 'roomNumber type pricePerNight')
        .exec();
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Error while retrieving bookings', error });
    }
  }

  public async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate('client', 'firstName lastName email')
        .populate('room', 'roomNumber type pricePerNight')
        .exec();
      
      if (!booking) {
        res.status(404).json({ message: 'Booking not found' });
        return;
      }
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Error while retrieving booking', error });
    }
  }

  public async cancelBooking(req: Request, res: Response): Promise<void> {
    try {
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status: 'cancelled' },
        { new: true }
      )
        .populate('client room')
        .exec();
      
      if (!booking) {
        res.status(404).json({ message: 'Booking not found' });
        return;
      }
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Error while canceling booking', error });
    }
  }
}
