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
    division: { 
        type: String, 
        required: true 
    },
    // adminSignaturePhoto: { 
    //     type: String 
    // }
}, {timestamps: true});

export default mongoose.model('Admin', adminSchema);
