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
import userProtectRoute from '../middleware/userProtectRoute.js';
import adminProtectRoute from '../middleware/adminProtectRoute.js';

const router = express.Router();

//In the future, add auth

router.post('/', createReceipt);

router.get('/', adminProtectRoute, getAllReceipts); //used by admin

router.get('/:id', getReceiptById);

router.put('/:id', updateReceipt);

router.delete('/:id', deleteReceipt);

router.get("/user/:userId", userProtectRoute ,getReceiptsByUser); // used by user

router.get("/unread/:userId", userProtectRoute, getAllUnreadReceiptsByUserId); // used by user

router.patch("/mark-read/:id", userProtectRoute, markReceiptAsRead); // used by user

export default router;
