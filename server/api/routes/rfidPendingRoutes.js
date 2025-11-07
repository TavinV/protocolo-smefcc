import express from 'express';
import rfidPendingController from '../controllers/rfidPendingController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, rfidPendingController.getAll);
router.post('/', authenticateToken, rfidPendingController.create);
router.delete('/:id', authenticateToken, rfidPendingController.remove);

export default router;