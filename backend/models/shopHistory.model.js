// models/ShopOccupancyHistory.js
import mongoose from 'mongoose';

const ShopHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    marketHallNo: { 
        type: String, 
        required: true 
    },
    shopNo: { 
        type: String, 
        required: true 
    },
    totalPaid: {
        type: Number,
    },
    assignedDate: {
        type: Date,
        required: true,
    },
    releasedDate: {
        type: Date,
        required: true
    }
});

export default mongoose.model('ShopHistory', ShopHistorySchema);
