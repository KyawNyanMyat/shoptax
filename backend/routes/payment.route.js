// routes/payment.routes.js
import express from 'express';
import { 
    createPayment, deletePayment, 
    getAllPayments, getOverdueUsers, getPaymentById, 
    getPaymentByUserId, getPendingPayments, 
    updatePayment, 
    updatePaymentStatus
} from '../controllers/payment.controller.js';
import upload from '../middleware/upload.js';
import userProtectRoute from '../middleware/userProtectRoute.js';


const router = express.Router();

router.post('/', userProtectRoute , upload.single("paymentPhoto"), createPayment); // used by user

router.get("/pending", getPendingPayments);

router.get('/', getAllPayments); // used by admin

router.get('/:id', getPaymentById);

router.get('/user/overdue', getOverdueUsers);

router.get('/user/:id', userProtectRoute , getPaymentByUserId); //used by user

router.put('/:id', updatePayment);

router.delete('/:id', deletePayment);

router.patch('/changestatus/:id/', updatePaymentStatus); // used by admin



export default router;
