// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    password: {
        type: String,
        required: true 
    },
    NRC: { 
        type: String, 
        required: true 
    },
    phoneNo: { 
        type: String, 
        required: true 
    },
    gender: { 
        type: String, 
        enum: ['Male', 'Female'], 
        required: true 
    },
    occupancyStatus: { 
        type: String, 
        enum: ['current', 'past'], 
        default: 'current' 
    },
    ownShop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        require: true
    }
}, {timestamps: true});

export default mongoose.model('User', userSchema);
