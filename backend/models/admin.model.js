// models/Admin.js
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    adminName: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    phoneNo: { 
        type: String, 
        required: true 
    },
    department: { 
        type: String, 
        required: true 
    },
    adminSignaturePhoto: { 
        type: String 
    }
}, {timestamps: true});

export default mongoose.model('Admin', adminSchema);
