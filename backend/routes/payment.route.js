// routes/payment.routes.js
import express from 'express';
import { 
    createPayment, deletePayment, 
    getAllPayments, getPaymentById, 
    getPaymentByUserId, updatePayment 
} from '../controllers/payment.controller.js';
import upload from '../middleware/upload.js';


const router = express.Router();

router.post('/',upload.single("paymentPhoto"), createPayment);

router.get('/', getAllPayments);

router.get('/:id', getPaymentById);

router.get('/user/:id', getPaymentByUserId);

router.put('/:id', updatePayment);

router.delete('/:id', deletePayment);

export default router;
