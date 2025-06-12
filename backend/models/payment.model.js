// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    paymentType: { 
        type: String, 
        required: true 
    },
    marketHallNo: { 
        type: String, 
        required: true 
    },
    shopNo: { 
        type: String, 
        required: true 
    },
    paymentPhoto: { 
        type: String 
    }, 
    paidDate: { 
        type: Date, 
        required: true 
    },
    nextPaymentDueDate: { 
        type: Date 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Finished'], 
        default: 'Pending' 
    }
});

export default mongoose.model('Payment', paymentSchema);
