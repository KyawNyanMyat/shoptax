// routes/receipt.routes.js
import express from 'express';
import {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt
} from '../controllers/receipt.controller.js';

const router = express.Router();

router.post('/', createReceipt);

router.get('/', getAllReceipts);

router.get('/:id', getReceiptById);

router.put('/:id', updateReceipt);

router.delete('/:id', deleteReceipt);

export default router;
