import { Request, Response } from 'express';
import Room, { IRoom } from '../models/room.model';

export class RoomController {
  // get all rooms
  public async getAllRooms(req: Request, res: Response): Promise<void> {
    try {
      const rooms = await Room.find();
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving rooms', error });
    }
  }

  // get available rooms
  public async getAvailableRooms(req: Request, res: Response): Promise<void> {
    try {
      const rooms = await Room.find({ isAvailable: true });
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving available rooms', error });
    }
  }

  // get room by id
  public async getRoomById(req: Request, res: Response): Promise<void> {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        res.status(404).json({ message: 'Room not found' });
        return;
      }
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving room', error });
    }
  }

  // create new room
  public async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const newRoom = new Room(req.body);
      const savedRoom = await newRoom.save();
      res.status(201).json(savedRoom);
    } catch (error) {
      res.status(400).json({ message: 'Error creating room', error });
    }
  }

  // update room
  public async updateRoom(req: Request, res: Response): Promise<void> {
    try {
      const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedRoom) {
        res.status(404).json({ message: 'Room not found' });
        return;
      }
      res.status(200).json(updatedRoom);
    } catch (error) {
      res.status(400).json({ message: 'Error updating room', error });
    }
  }
}
