import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import inventoryRoutes from './routes/inventory.routes';
import salesRoutes from './routes/sales.routes';
import { dashboardController } from './controllers/dashboard.controller';
import { reportController } from './controllers/report.controller';
import { authMiddleware } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);

app.get('/api/dashboard', authMiddleware, dashboardController.getStats);
app.get('/api/reports/sales', authMiddleware, reportController.getSalesReport);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
