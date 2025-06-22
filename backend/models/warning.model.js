// models/Warning.js
import mongoose from 'mongoose';

const warningSchema = new mongoose.Schema({
    warningTitle: {
        type: String, 
        required: true 
    },
    warningContent: { 
        type: String, 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    issueDate: { 
        type: Date, 
        default: Date.now 
    },
    overdueFee: {
        type: Number,
        default: 100
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
});

export default mongoose.model('Warning', warningSchema);
