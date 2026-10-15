import { Router } from 'express';
import { reportController } from '../controllers/report.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/sales', reportController.getSalesReport);
router.get('/revenue-trends', reportController.getRevenueTrends);
router.get('/category-performance', reportController.getCategoryPerformance);
router.get('/top-products', reportController.getTopProducts);

export default router;
