import { pool } from '../config/database';
import { ProductInput } from '../types/product';

export class ProductService {
  async listProducts(userId: string) {
    const result = await pool.query(
      'SELECT * FROM products WHERE user_id = $1 ORDER BY name ASC',
      [userId]
    );
    return result.rows;
  }

  async getProduct(userId: string, productId: string) {
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND user_id = $2',
      [productId, userId]
    );
    return result.rows[0];
  }

  async createProduct(userId: string, data: ProductInput) {
    const { name, category, price, stock_quantity, low_stock_threshold } = data;
    const result = await pool.query(
      'INSERT INTO products (user_id, name, category, price, stock_quantity, low_stock_threshold) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, name, category, price, stock_quantity, low_stock_threshold]
    );
    return result.rows[0];
  }

  async updateProduct(userId: string, productId: string, data: Partial<ProductInput>) {
    const entries = Object.entries(data);
    if (entries.length === 0) return this.getProduct(userId, productId);

    const fields = entries.map(([key], index) => `${key} = $${index + 2}`).join(', ');
    const values = entries.map(([, value]) => value);

    const result = await pool.query(
      `UPDATE products SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING *`,
      [productId, userId, ...values]
    );
    return result.rows[0];
  }

  async deleteProduct(userId: string, productId: string) {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING id',
      [productId, userId]
    );
    return result.rowCount > 0;
  }
}

export const productService = new ProductService();
