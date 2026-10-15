import { Request, Response } from 'express';
import { settingsService } from '../services/settings.service';

export const settingsController = {
  async get(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const settings = await settingsService.getSettings(userId);
      if (!settings) {
        return res.status(404).json({ success: false, message: 'Settings not found' });
      }
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const settings = await settingsService.updateSettings(userId, req.body);
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
