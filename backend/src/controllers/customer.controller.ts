import { Request, Response } from 'express';
import { customerService } from '../services/customer.service';

export const customerController = {
  async getAll(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const customers = await customerService.getAllCustomers(userId);
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const customer = await customerService.getCustomerById(userId, req.params.id);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const customer = await customerService.createCustomer(userId, req.body);
      res.status(201).json(customer);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const customer = await customerService.updateCustomer(userId, req.params.id, req.body);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const success = await customerService.deleteCustomer(userId, req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
      res.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
