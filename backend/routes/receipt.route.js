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

//In the future, add auth

router.post('/', createReceipt);

router.get('/', getAllReceipts); //use by admin

router.get('/:id', getReceiptById);

router.put('/:id', updateReceipt);

router.delete('/:id', deleteReceipt);

router.get("/user/:userId", getReceiptsByUser);

router.get("/unread/:userId", getAllUnreadReceiptsByUserId); // used by user

router.patch("/mark-read/:id", markReceiptAsRead);

export default router;
