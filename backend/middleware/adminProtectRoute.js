import jwt from 'jsonwebtoken'
import Admin from '../models/admin.model.js';

const adminProtectRoute = async (req, res, next)=>{
    try {
        const token = req.cookies.admintoken; // got from generateUserToken
        if(!token){
            return res.status(401).json({message: "အကောင့်အရင်၀င်ပါ"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN)
        if(!decoded){
            return res.status(401).json({message: "Token မရှိပါ"})
        }
        
        const admin = await Admin.findOne({_id: decoded.AdminId}).select("-adminPassword")

        if(!admin){
            return res.status(404).json({message: "အသုံးပြုသူမတွေ့ရှိပါ"});
        }

        req.admin = admin

        next()
    } catch (error) {
        console.log("Error in userProtectRoute", error)
        res.status(500).json({message: "Server ပြဿနာဖြစ်ပေါ်နေပါသည်"})
    }
}

export default adminProtectRoute