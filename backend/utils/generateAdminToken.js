import jwt from 'jsonwebtoken';

const generateAdminTokenAndCookie = (AdminId, res)=>{
    const token = jwt.sign({AdminId},process.env.JWT_SECRET,{expiresIn:"15d"})

    //store token in cookie
    res.cookie('admintoken',token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 15
    })
}

export default generateAdminTokenAndCookie