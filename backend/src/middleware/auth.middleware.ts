import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized: No token provided' },
    });
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized: No token provided' },
    });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (
      typeof decoded === 'string' ||
      typeof decoded.userId !== 'string' ||
      typeof decoded.email !== 'string'
    ) {
      throw new Error('Invalid token payload');
    }

    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized: Invalid token' },
    });
  }
};
