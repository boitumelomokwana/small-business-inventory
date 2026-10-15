import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { pool } from '../config/database';
import { env } from '../config/env';
import { loginSchema, registerSchema } from '../validators/auth.validator';

type RegisterData = z.infer<typeof registerSchema>;
type LoginData = z.infer<typeof loginSchema>;

export interface User {
  id: string;
  name: string;
  email: string;
}

export class AuthService {
  async register(userData: RegisterData) {
    const { name, email, password } = userData;

    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rowCount) {
      throw new Error('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, passwordHash]
    );

    return result.rows[0];
  }

  async login(credentials: LoginData) {
    const { email, password } = credentials;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async me(userId: string) {
    const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [userId]);
    return result.rows[0];
  }
}

export const authService = new AuthService();
