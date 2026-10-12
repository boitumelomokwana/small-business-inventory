import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/:id/adjust-stock', inventoryController.adjustStock);
router.get('/:id/adjustments', inventoryController.listAdjustments);

export default router;
