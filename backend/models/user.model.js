// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        unique: true 
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
        required: true,
        unique: true
    },
    phoneNo: { 
        type: String, 
        required: true,
    },
    gender: { 
        type: String, 
        enum: ['Male', 'Female'], 
        required: true 
    }
}, {timestamps: true});

export default mongoose.model('User', userSchema);
