import { parse } from "dotenv";
import { Server } from "socket.io";
import cookie from "cookie"; // for web socket
import jwt from "jsonwebtoken"

let io;

export const initSocket = (server)=>{
    io = new Server(server, {
        cors:{
            origin: "http://localhost:3000",
            methods:['GET', 'POST'],
            credentials: true,
            connectionStateRecovery: {
                maxDisconnectionDuration: 2 * 60 * 1000, // 2 min
                //skipMiddlewares: true
            },
            pingInterval: 20000, // send ping to all connected socket
            pingTimeout: 10000 // wait pong from socket
        }
    })

    io.on("connection", (socket)=>{
        console.log("A client connected", socket.id);

        socket.on("disconnect", (reason)=>{
            console.log("Client disconnected", socket.id, reason)
        })

        socket.on("error", (err) => {
            console.error(`Socket error from ${socket.id}:`, err);
        });
        
        try {
            const cookies = socket.handshake.headers.cookie;
            if(!cookies) return;
            
            const parsed = cookie.parse(cookies);

            if (parsed.usertoken) {
                const decoded = jwt.verify(parsed.usertoken, process.env.JWT_SECRET_USER);
                const userId = decoded.UserId;
                socket.join(userId); // Join user room
                console.log(`User socket joined room ${userId}`);
            }
              
            if (parsed.admintoken) {
                const decoded = jwt.verify(parsed.admintoken, process.env.JWT_SECRET_ADMIN);
                const adminId = decoded.AdminId;
                socket.join(`adminRoom`); // Join admin room
                console.log(`Admin socket joined room admin-${adminId}`);
            }
        } catch (error) {
            console.log(error)
            socket.disconnect(true)
            return
        }

        // socket.on('disconnecting', () => {
        //     console.log('Client disconnecting:', socket.id, socket.rooms);
        // });
    })

    return io
}

export const getIO = () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
};