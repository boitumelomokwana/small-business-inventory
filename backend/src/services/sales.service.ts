import { pool } from '../config/database';

export interface SaleItemInput {
  productId: string;
  quantity: number;
}

export class SalesService {
  async createSale(userId: string, items: SaleItemInput[]) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      let totalAmount = 0;
      const saleItemsToCreate = [];

      for (const item of items) {
        const productRes = await client.query(
          'SELECT id, name, price, stock_quantity FROM products WHERE id = $1 AND user_id = $2 FOR UPDATE',
          [item.productId, userId]
        );

        if (productRes.rowCount === 0) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        const product = productRes.rows[0];
        if (product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;

        saleItemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          unit_price: product.price,
          subtotal: subtotal,
        });

        await client.query(
          'UPDATE products SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [item.quantity, product.id]
        );
      }

      const saleRes = await client.query(
        'INSERT INTO sales (user_id, total_amount) VALUES ($1, $2) RETURNING id',
        [userId, totalAmount]
      );
      const saleId = saleRes.rows[0].id;

      for (const item of saleItemsToCreate) {
        await client.query(
          'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5)',
          [saleId, item.productId, item.quantity, item.unit_price, item.subtotal]
        );
      }

      await client.query('COMMIT');
      return { saleId, totalAmount };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async listSales(userId: string, start?: string, end?: string) {
    let queryText = 'SELECT * FROM sales WHERE user_id = $1';
    const params: any[] = [userId];

    if (start && end) {
      queryText += ' AND created_at BETWEEN $2 AND $3';
      params.push(start, end);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await pool.query(queryText, params);
    return result.rows;
  }

  async getSale(userId: string, saleId: string) {
    const saleRes = await pool.query(
      'SELECT * FROM sales WHERE id = $1 AND user_id = $2',
      [saleId, userId]
    );

    if (saleRes.rowCount === 0) return null;

    const itemsRes = await pool.query(
      'SELECT si.*, p.name as product_name FROM sale_items si JOIN products p ON si.product_id = p.id WHERE si.sale_id = $1',
      [saleId]
    );

    return {
      ...saleRes.rows[0],
      items: itemsRes.rows,
    };
  }
}

export const salesService = new SalesService();
