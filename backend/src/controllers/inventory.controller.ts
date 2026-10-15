import { Request, Response } from 'express';
import { z } from 'zod';
import { pool } from '../config/database';

const adjustStockSchema = z.object({
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  type: z.enum(['INCREASE', 'DECREASE']),
  reason: z.string().trim().min(2, 'Reason must be at least 2 characters'),
});

export class InventoryController {
  async adjustStock(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const { id: productId } = req.params;
      const validatedData = adjustStockSchema.parse(req.body);
      const { quantity, type, reason } = validatedData;

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const productRes = await client.query(
          'SELECT stock_quantity FROM products WHERE id = $1 AND user_id = $2 FOR UPDATE',
          [productId, userId]
        );

        if (productRes.rowCount === 0) {
          throw new Error('Product not found');
        }

        const currentStock = productRes.rows[0].stock_quantity;
        let nextStock = currentStock;

        if (type === 'INCREASE') {
          nextStock += quantity;
        } else {
          nextStock -= quantity;
          if (nextStock < 0) {
            throw new Error('Insufficient stock for decrease');
          }
        }

        await client.query(
          'UPDATE products SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [nextStock, productId]
        );

        await client.query(
          'INSERT INTO inventory_adjustments (user_id, product_id, quantity, type, reason) VALUES ($1, $2, $3, $4, $5)',
          [userId, productId, quantity, type, reason]
        );

        await client.query('COMMIT');
        res.json({ success: true, data: { newStock: nextStock } });
      } catch (error: any) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  async listAdjustments(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const { id: productId } = req.params;

      const result = await pool.query(
        'SELECT * FROM inventory_adjustments WHERE product_id = $1 AND user_id = $2 ORDER BY created_at DESC',
        [productId, userId]
      );
      res.json({ success: true, data: result.rows });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
}

export const inventoryController = new InventoryController();
