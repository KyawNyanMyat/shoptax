// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    shopId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Shop', 
        required: true 
    },
    paymentType: { 
        type: String,
        enum: ["NRC Register Cost", "Land Rent Cost"],
        required: true 
    },
    paymentPhoto: { 
        type: String,
        required: true
    }, 
    amount: {
        type: Number,
        required: true
    },
    paidDate: { 
        type: Date, 
        required: true,
        default: Date.now 
    },
    nextPaymentDueDate: { 
        type: Date 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Finished', 'Rejected'], 
        default: 'Pending' 
    }
});

export default mongoose.model('Payment', paymentSchema);
