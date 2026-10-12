import { pool } from '../config/database';

export interface DashboardStats {
  totalProducts: number;
  totalStockUnits: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  todayRevenue: number;
  todaySalesCount: number;
  salesOverTime: Array<{ date: string; revenue: number }>;
  topProducts: Array<{ name: string; quantity: number }>;
}

export class DashboardService {
  async getStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString();

    const [productsRes, salesRes, topProductsRes] = await Promise.all([
      pool.query('SELECT id, stock_quantity, low_stock_threshold FROM products WHERE user_id = $1', [userId]),
      pool.query(
        'SELECT total_amount FROM sales WHERE user_id = $1 AND created_at >= $2',
        [userId, todayIso]
      ),
      pool.query(
        `SELECT p.name, SUM(si.quantity) as total_qty
         FROM sale_items si
         JOIN products p ON si.product_id = p.id
         JOIN sales s ON si.sale_id = s.id
         WHERE s.user_id = $1
         GROUP BY p.name
         ORDER BY total_qty DESC
         LIMIT 5`,
        [userId]
      ),
    ]);

    const products = productsRes.rows;
    const todaySales = salesRes.rows;

    const totalProducts = products.length;
    const totalStockUnits = products.reduce((sum, p) => sum + p.stock_quantity, 0);
    const lowStockProducts = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold).length;
    const outOfStockProducts = products.filter(p => p.stock_quantity === 0).length;
    const todayRevenue = todaySales.reduce((sum, s) => sum + Number(s.total_amount), 0);
    const todaySalesCount = todaySales.length;

    const salesOverTimeRes = await pool.query(
      `SELECT DATE(created_at) as date, SUM(total_amount) as revenue
       FROM sales
       WHERE user_id = $1
       GROUP BY date
       ORDER BY date ASC
       LIMIT 30`,
      [userId]
    );

    return {
      totalProducts,
      totalStockUnits,
      lowStockProducts,
      outOfStockProducts,
      todayRevenue,
      todaySalesCount,
      salesOverTime: salesOverTimeRes.rows.map(r => ({
        date: r.date.toISOString().split('T')[0],
        revenue: Number(r.revenue),
      })),
      topProducts: topProductsRes.rows.map(r => ({
        name: r.name,
        quantity: parseInt(r.total_qty),
      })),
    };
  }
}

export const dashboardService = new DashboardService();
