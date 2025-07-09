import jwt from 'jsonwebtoken'
import Admin from '../models/admin.model.js';
import { redis } from '../utils/redlock.js';

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

        // const activeToken = await redis.get(`locks:admin:active:${decoded.AdminId}`); // get from login user controller
        // if(activeToken != token){
        //     return res.status(403).json({ message: "အကောင့်သည် တခြားနေရာ၌ အသုံးပြုနေသည်။" });
        // }

        const admin = await Admin.findOne({_id: decoded.AdminId}).select("-adminPassword")

        if(!admin){
            return res.status(404).json({message: "အသုံးပြုသူမတွေ့ရှိပါ"});
        }

        req.admin = admin

        next()
    } catch (error) {
        console.log("Error in userProtectRoute", error)
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
              message: "သင့် session သက်တမ်းကုန်သွားပါပြီ။ ပြန်လည် login ဝင်ပါ။"
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "မမှန်ကန်သော Token ဖြစ်ပါသည်။"
            });
        }
        res.status(500).json({message: "Server ပြဿနာဖြစ်ပေါ်နေပါသည်"})
    }
}

export default adminProtectRoute