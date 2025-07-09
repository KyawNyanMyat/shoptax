import jwt from 'jsonwebtoken';

const generateUserTokenAndCookie = (UserId, res)=>{
    const token = jwt.sign({UserId},process.env.JWT_SECRET_USER,{expiresIn:"1d"})

    //store token in cookie
    res.cookie('usertoken',token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24
    })

    return token;
}

export default generateUserTokenAndCookie