// routes/receipt.routes.js
import express from 'express';
import {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt,
  getReceiptsByUser,
  markReceiptAsRead,
  getAllUnreadReceiptsByUserId
} from '../controllers/receipt.controller.js';

const router = express.Router();

router.post('/', createReceipt);

router.get('/', getAllReceipts);

router.get('/:id', getReceiptById);

router.put('/:id', updateReceipt);

router.delete('/:id', deleteReceipt);

router.get("/user/:userId", getReceiptsByUser);

router.get("/unread/:userId", getAllUnreadReceiptsByUserId);

router.patch("/mark-read/:id", markReceiptAsRead);

export default router;
