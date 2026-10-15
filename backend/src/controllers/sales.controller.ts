import { Request, Response } from 'express';
import { salesService } from '../services/sales.service';
import { z } from 'zod';

const saleSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
});

export class SalesController {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const validatedData = saleSchema.parse(req.body);
      const result = await salesService.createSale(userId, validatedData.items);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const { start, end } = req.query;
      const limitParam = req.query.limit;
      const limit = typeof limitParam === 'string' ? Number(limitParam) : undefined;

      if (
        limitParam !== undefined &&
        (limit === undefined ||
          !Number.isInteger(limit) ||
          limit < 1 ||
          limit > 100)
      ) {
        return res.status(400).json({
          success: false,
          error: { message: 'Limit must be an integer between 1 and 100' },
        });
      }

      const sales = await salesService.listSales(
        userId,
        typeof start === 'string' ? start : undefined,
        typeof end === 'string' ? end : undefined,
        limit,
      );
      res.json({ success: true, data: sales });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const sale = await salesService.getSale(userId, id);
      if (!sale) return res.status(404).json({ success: false, error: { message: 'Sale not found' } });
      res.json({ success: true, data: sale });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
}

export const salesController = new SalesController();
