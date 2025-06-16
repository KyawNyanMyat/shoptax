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
    // status: {
    //     type: String,
    //     enum: ["Usable", "Not Usable"],
    //     default: "Usable"
    // }
});

export default mongoose.model('Shop', shopSchema);
