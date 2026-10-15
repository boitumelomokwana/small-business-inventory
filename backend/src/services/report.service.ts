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

export interface RevenueTrend {
  period: string;
  revenue: number;
}

export interface CategoryPerformance {
  category: string;
  total_sales: number;
  revenue: number;
}

export interface TopProduct {
  product_name: string;
  total_quantity: number;
  total_revenue: number;
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

  async getRevenueTrends(userId: string) {
    const res = await pool.query(
      `SELECT
        TO_CHAR(s.created_at, 'YYYY-MM') as period,
        SUM(s.total_amount) as revenue
       FROM sales s
       WHERE s.user_id = $1
       GROUP BY period
       ORDER BY period ASC`,
      [userId]
    );
    return res.rows.map(r => ({
      period: r.period,
      revenue: Number(r.revenue)
    }));
  }

  async getCategoryPerformance(userId: string) {
    const res = await pool.query(
      `SELECT
        p.category,
        COUNT(si.id) as total_sales,
        SUM(si.subtotal) as revenue
       FROM sale_items si
       JOIN sales s ON si.sale_id = s.id
       JOIN products p ON si.product_id = p.id
       WHERE s.user_id = $1
       GROUP BY p.category
       ORDER BY revenue DESC`,
      [userId]
    );
    return res.rows.map(r => ({
      category: r.category,
      total_sales: parseInt(r.total_sales),
      revenue: Number(r.revenue)
    }));
  }

  async getTopProducts(userId: string) {
    const res = await pool.query(
      `SELECT
        p.name as product_name,
        SUM(si.quantity) as total_quantity,
        SUM(si.subtotal) as total_revenue
       FROM sale_items si
       JOIN sales s ON si.sale_id = s.id
       JOIN products p ON si.product_id = p.id
       WHERE s.user_id = $1
       GROUP BY p.name
       ORDER BY total_revenue DESC
       LIMIT 5`,
      [userId]
    );
    return res.rows.map(r => ({
      product_name: r.product_name,
      total_quantity: parseInt(r.total_quantity),
      total_revenue: Number(r.total_revenue)
    }));
  }
}

export const reportService = new ReportService();
