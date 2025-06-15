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
    profilePhoto: {
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
        enum: ['male', 'female'], 
        required: true 
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        require: true
    }
}, {timestamps: true});

export default mongoose.model('User', userSchema);
