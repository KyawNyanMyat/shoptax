import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    adminName: { 
        type: String, 
        required: true 
    },
    adminPassword: { 
        type: String, 
        required: true 
    },
    profilePhoto: {
        type: String,
        required: true 
    },
    phoneNo: { 
        type: String, 
        required: true 
    },
    section: { 
        type: String, 
        required: true 
    },
    position: {
        type: String,
        required: true
    }
    // adminSignaturePhoto: { 
    //     type: String 
    // }
}, {timestamps: true});

export default mongoose.model('Admin', adminSchema);
