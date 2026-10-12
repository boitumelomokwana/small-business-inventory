import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await authService.register(validatedData);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(401).json({ success: false, error: { message: error.message } });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const user = await authService.me(userId);
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
}

export const authController = new AuthController();
