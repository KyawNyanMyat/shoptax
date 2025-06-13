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
import ShopHistoryRoutes from "./routes/shopHistory.route.js"

dotenv.config()

const port = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())


app.use('/api/shops',ShopRoutes);
app.use('/api/users', UserRoutes);

//neet to test
app.use('/api/admins', AdminRoutes);
app.use('/api/payments', PaymentRoutes);
app.use('/api/receipts', ReceiptRoutes);
app.use('/api/shopHistories', ShopHistoryRoutes);
app.use('/api/warnings', WarningRoutes)

connectToDB()
.then(()=>{
    app.listen(port,()=>{
        console.log("Server is running at port", port)
    })
})
.catch((error)=>{
    console.log("Error in connecting to DB",error.message)
})
