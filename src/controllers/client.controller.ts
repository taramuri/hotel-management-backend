import { Request, Response } from 'express';
import Client, { IClient } from '../models/client.model';

export class ClientController {
  // get all clients
  public async getAllClients(req: Request, res: Response): Promise<void> {
    try {
      const clients = await Client.find();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ message: 'Error while receiving customers', error });
    }
  }

  // get client by id
  public async getClientById(req: Request, res: Response): Promise<void> {
    try {
      const client = await Client.findById(req.params.id);
      if (!client) {
        res.status(404).json({ message: 'Customer not found' });
        return;
      }
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ message: 'Error while receiving customer', error });
    }
  }

  // create new client
  public async createClient(req: Request, res: Response): Promise<void> {
    try {
      const newClient = new Client(req.body);
      const savedClient = await newClient.save();
      res.status(201).json(savedClient);
    } catch (error) {
      res.status(400).json({ message: 'Error creating client', error });
    }
  }

  // update client
  public async updateClient(req: Request, res: Response): Promise<void> {
    try {
      const updatedClient = await Client.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedClient) {
        res.status(404).json({ message: 'Customer not found' });
        return;
      }
      res.status(200).json(updatedClient);
    } catch (error) {
      res.status(400).json({ message: 'Updating client error', error });
    }
  }

  // delete client
  public async deleteClient(req: Request, res: Response): Promise<void> {
    try {
      const deletedClient = await Client.findByIdAndDelete(req.params.id);
      if (!deletedClient) {
        res.status(404).json({ message: 'Customer not found' });
        return;
      }
      res.status(200).json({ message: 'Client successfully deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting client', error });
    }
  }
}