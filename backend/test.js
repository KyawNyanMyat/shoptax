// server/test.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET","POST"]
    }
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("send_message", (data) => {
    console.log("📩 Message received:", data);

    // Emit to everyone including sender
    io.emit("receive_message", data);

    // Or: socket.broadcast.emit("receive_message", data); // exclude sender
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
