import dotenv from "dotenv"
import express from "express"
import { connectToDB } from "./db/connectToDB";
import cookieParser from "cookie-parser";

dotenv.config()

const port = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())

connectToDB()
.then(()=>{
    app.listen(port,()=>{
        console.log("Server is running at port", port)
    })
})
.catch((error)=>{
    console.log("Error in connecting to DB",error.message)
})
