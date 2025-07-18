import jwt from 'jsonwebtoken';

const generateAdminTokenAndCookie = (AdminId, res)=>{
    const token = jwt.sign({AdminId},process.env.JWT_SECRET_ADMIN,{expiresIn:"1d"})

    //store token in cookie
    res.cookie('admintoken',token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24
    })

    return token
}

export default generateAdminTokenAndCookie