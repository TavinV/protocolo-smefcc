import express from 'express';
import transactionController from '../controllers/transactionController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authenticateXApiKey } from '../middleware/authXApiKey.js';

const router = express.Router();

router.post('/', authenticateXApiKey, transactionController.createTransaction);
router.get('/', authenticateToken, transactionController.getTransactions);

router.get('/borrowed', authenticateToken, transactionController.getAllBorrowedItems);
router.get('/last/:itemId', authenticateToken, transactionController.getLastTransactionByItemId);

router.get('/:id', authenticateToken, transactionController.getTransactionById);

export default router;