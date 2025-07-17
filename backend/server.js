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
import { connectToRedis } from "./utils/redlock.js";
import http from "http"
import { initSocket } from "./socket/socket.js";

dotenv.config()

const port = process.env.PORT || 5000
const app = express()
//
app.use("/uploads", express.static(path.join(path.resolve(),"backend", "uploads")));
app.use(express.static(path.join(path.resolve(),"frontend", "dist")))

// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true
// }))
app.use(express.json())
app.use(cookieParser())


app.use('/api/shops',ShopRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/admins', AdminRoutes);
app.use('/api/payments', PaymentRoutes);
app.use('/api/receipts', ReceiptRoutes);
app.use('/api/warnings', WarningRoutes);

// app.get(/^\/(?!api|uploads).*/, (req, res) => {
//     res.sendFile(path.join(path.resolve(), "frontend", "dist", "index.html")); // for js,css, png...
// });
app.use((req, res) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      return res.status(404).send('Not found');
    }
    res.sendFile(path.join(path.resolve(), "frontend", "dist", "index.html"));
});
  
const startServer = async ()=>{
    try {
        await connectToDB();
        await connectToRedis()

        const server = http.createServer(app)
        initSocket(server)

        server.listen(port, ()=>{
            console.log("Server is running in port ",port)
        })
    } catch (error) {
        console.log("failed to start server", error.message)
        process.exit(1)
    }
}

startServer()