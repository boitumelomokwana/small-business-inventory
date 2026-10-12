import { Request, Response } from 'express';
import { reportService } from '../services/report.service';

export class ReportController {
  async getSalesReport(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
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
}

export const reportController = new ReportController();
