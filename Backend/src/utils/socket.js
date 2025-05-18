// src/socket/socket.js  (or wherever you keep this)

import { Server } from "socket.io";
import { httpServer } from "../app.js";
// import dotenv from "dotenv";
// dotenv.config();

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        sameSite:'Lax'
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}
const userSocketMap = {};

const getOnlineUsers = () => Object.keys(userSocketMap);

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`🟢 User connected: ${userId}`);
    }
    
    io.emit("getOnlineUsers", getOnlineUsers());
    
    socket.on("disconnect", () => {
        if (userId && userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
            console.log(`🔴 User disconnected: ${userId}`);
        }

        io.emit("getOnlineUsers", getOnlineUsers());
    });
});


export { io };
