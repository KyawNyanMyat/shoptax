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
    superAdminSignaturePhoto: {
        type: String,
        default: '/images/SuperAdminSignature.png' // adjust this path based on your setup
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
