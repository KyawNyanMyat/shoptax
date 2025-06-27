import jwt from 'jsonwebtoken';

const generateUserTokenAndCookie = (UserId, res)=>{
    const token = jwt.sign({UserId},process.env.JWT_SECRET_USER,{expiresIn:"15d"}) //In the future change day

    //store token in cookie
    res.cookie('usertoken',token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 15
    })
}

export default generateUserTokenAndCookie