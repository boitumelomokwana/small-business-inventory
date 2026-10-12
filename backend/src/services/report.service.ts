import { pool } from '../config/database';

export interface SalesReport {
  totalRevenue: number;
  transactionCount: number;
  totalItemsSold: number;
  avgTransactionValue: number;
  sales: Array<{
    id: string;
    created_at: string;
    item_count: number;
    total_amount: number;
  }>;
}

export class ReportService {
  async getSalesReport(userId: string, start: string, end: string) {
    const salesRes = await pool.query(
      `SELECT s.id, s.created_at, s.total_amount, COUNT(si.id) as item_count
       FROM sales s
       JOIN sale_items si ON s.id = si.sale_id
       WHERE s.user_id = $1 AND s.created_at BETWEEN $2 AND $3
       GROUP BY s.id
       ORDER BY s.created_at DESC`,
      [userId, start, end]
    );

    const sales = salesRes.rows;
    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);
    const transactionCount = sales.length;
    const totalItemsSold = sales.reduce((sum, s) => sum + parseInt(s.item_count), 0);
    const avgTransactionValue = transactionCount > 0 ? totalRevenue / transactionCount : 0;

    return {
      totalRevenue,
      transactionCount,
      totalItemsSold,
      avgTransactionValue,
      sales: sales.map(s => ({
        id: s.id,
        created_at: s.created_at,
        item_count: parseInt(s.item_count),
        total_amount: Number(s.total_amount),
      })),
    };
  }
}

export const reportService = new ReportService();
