import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || '12345';

export class AuthController {
  // register new user
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, role } = req.body;

      // check if exist
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'User with such email already exists' });
        return;
      }

      const user = new User({ email, password, role });
      await user.save();

      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: user.role 
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );

      res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: 'Registration error: ', error });
    }
  }

  // sign in
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: 'Incorrect email or password' });
        return;
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        res.status(401).json({ message: 'Incorrect email or password' });
        return;
      }

      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: user.role 
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );

      res.status(200).json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: 'Login error', error });
    }
  }
}