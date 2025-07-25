import mongoose from "mongoose";

export const connectToDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database')
    } catch (error) {
        console.log("Error Connecting to database");
        throw error
    }
}

