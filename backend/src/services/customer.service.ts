import { pool } from '../config/database';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '../types/customer';

export const customerService = {
  async getAllCustomers(userId: string): Promise<Customer[]> {
    const res = await pool.query(
      'SELECT * FROM customers WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return res.rows;
  },

  async getCustomerById(userId: string, id: string): Promise<Customer | null> {
    const res = await pool.query(
      'SELECT * FROM customers WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return res.rows[0] || null;
  },

  async createCustomer(userId: string, data: CreateCustomerDto): Promise<Customer> {
    const { first_name, last_name, email, phone, address } = data;
    const res = await pool.query(
      `INSERT INTO customers (user_id, first_name, last_name, email, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, first_name, last_name, email, phone, address]
    );
    return res.rows[0];
  },

  async updateCustomer(userId: string, id: string, data: UpdateCustomerDto): Promise<Customer | null> {
    const editableFields = ['first_name', 'last_name', 'email', 'phone', 'address'] as const;
    const fields = editableFields.filter(key => data[key] !== undefined);
    if (fields.length === 0) return this.getCustomerById(userId, id);

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = fields.map(field => data[field]);

    const res = await pool.query(
      `UPDATE customers SET ${setClause}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId, ...values]
    );
    return res.rows[0] || null;
  },

  async deleteCustomer(userId: string, id: string): Promise<boolean> {
    const res = await pool.query(
      'DELETE FROM customers WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return res.rowCount !== 0;
  }
};
