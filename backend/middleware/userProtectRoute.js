import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';

const userProtectRoute = async (req, res, next)=>{
    try {
        const token = req.cookies.usertoken; // got from generateUserToken
        if(!token){
            return res.status(401).json({message: "အကောင့်အရင်၀င်ပါ"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER)
        if(!decoded){
            return res.status(401).json({message: "Token မရှိပါ"})
        }
        
        const user = await User.findOne({_id: decoded.UserId}).select("-password")

        if(!user){
            return res.status(404).json({message: "အသုံးပြုသူမတွေ့ရှိပါ"});
        }

        req.user = user

        next()
    } catch (error) {
        console.log("Error in userProtectRoute", error)
        res.status(500).json({message: "Server ပြဿနာဖြစ်ပေါ်နေပါသည်"})
    }
}

export default userProtectRoute