// models/Shop.js
import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
    marketHallNo: { 
        type: String, 
        required: true 
    },
    shopNo: { 
        type: String, 
        required: true 
    },
    chargeRate:{
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    // status: {
    //     type: String,
    //     enum: ["Available", "Occupied"],
    //     default: "Available"
    // }
});

export default mongoose.model('Shop', shopSchema);
