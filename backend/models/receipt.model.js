// models/Receipt.js
import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
    paymentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Payment', 
        required: true 
    },
    adminId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin', 
        required: true 
    },
    amount: {
        type: Number,
        required: true
    },
    issueDate: { 
        type: Date, 
        default: Date.now 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
});

export default mongoose.model('Receipt', receiptSchema);
