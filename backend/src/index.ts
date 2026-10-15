import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { pool } from './config/database';
import authRoutes from './routes/auth.routes';
import inventoryRoutes from './routes/inventory.routes';
import salesRoutes from './routes/sales.routes';
import { dashboardController } from './controllers/dashboard.controller';
import { authMiddleware } from './middleware/auth.middleware';
import productRoutes from './routes/product.routes';
import customerRoutes from './routes/customer.routes';
import settingsRoutes from './routes/settings.routes';
import reportRoutes from './routes/report.routes';

const app = express();

app.use(cors({
  origin: env.frontendOrigins,
}));
app.use(express.json({ limit: '1mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/dashboard', authMiddleware, dashboardController.getStats);

app.get('/health', (req, res) => {
  void pool.query('SELECT 1')
    .then(() => res.json({ success: true, status: 'ok' }))
    .catch((error: unknown) => {
      console.error('Readiness check failed', error);
      res.status(503).json({ success: false, status: 'unavailable' });
    });
});

const server = app.listen(env.port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${env.port}`);
});

const shutdown = () => {
  server.close((error) => {
    if (error) {
      console.error('HTTP server shutdown failed', error);
      process.exitCode = 1;
    }

    void pool.end().catch((poolError: unknown) => {
      console.error('Database pool shutdown failed', poolError);
      process.exitCode = 1;
    });
  });
};

process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
