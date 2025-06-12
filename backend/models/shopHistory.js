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
    assignedDate: {
        type: Date,
        required: true,
    },
    releasedDate: {
        type: Date,
        default: null,
    }
});

export default mongoose.model('ShopHistory', ShopHistorySchema);
