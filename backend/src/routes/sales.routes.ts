import { Router } from 'express';
import { salesController } from '../controllers/sales.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', salesController.create);
router.get('/', salesController.list);
router.get('/:id', salesController.get);

export default router;
