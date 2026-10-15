import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const stats = await dashboardService.getStats(userId);
      res.json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
}

export const dashboardController = new DashboardController();
