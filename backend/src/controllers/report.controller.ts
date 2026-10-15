import { Request, Response } from 'express';
import { reportService } from '../services/report.service';

export class ReportController {
  async getSalesReport(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const { start, end } = req.query;

      if (!start || !end) {
        return res.status(400).json({ success: false, error: { message: 'Start and end dates are required' } });
      }

      const report = await reportService.getSalesReport(userId, start as string, end as string);
      res.json({ success: true, data: report });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  async getRevenueTrends(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const trends = await reportService.getRevenueTrends(userId);
      res.json({ success: true, data: trends });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  async getCategoryPerformance(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const performance = await reportService.getCategoryPerformance(userId);
      res.json({ success: true, data: performance });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  async getTopProducts(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const products = await reportService.getTopProducts(userId);
      res.json({ success: true, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
}

export const reportController = new ReportController();
