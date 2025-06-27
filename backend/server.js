import dotenv from "dotenv"
import express from "express"
import { connectToDB } from "./db/connectToDB.js";
import cookieParser from "cookie-parser";
import ShopRoutes from "./routes/shop.route.js"
import UserRoutes from "./routes/user.route.js"
import AdminRoutes from "./routes/admin.route.js"
import PaymentRoutes from "./routes/payment.route.js"
import ReceiptRoutes from "./routes/receipt.route.js"
import WarningRoutes from "./routes/warning.route.js"
import path from 'path';
import cors from "cors";


dotenv.config()

const port = process.env.PORT || 5000
const app = express()


app.use("/uploads", express.static(path.join(path.resolve(),"backend", "uploads")));

app.use(express.json())
app.use(cookieParser())

//In the future(make 404 when user enter invalid url)

app.use('/api/shops',ShopRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/admins', AdminRoutes);
app.use('/api/payments', PaymentRoutes);
app.use('/api/receipts', ReceiptRoutes);
app.use('/api/warnings', WarningRoutes);


connectToDB()
.then(()=>{
    app.listen(port,()=>{
        console.log("Server is running at port", port)
    })
})
.catch((error)=>{
    console.log("Error in connecting to DB",error.message)
})
