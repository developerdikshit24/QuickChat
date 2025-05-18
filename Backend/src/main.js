import './utils/socket.js';
import dotenv from "dotenv"
import connectDB from './db/index.js';
import { app, httpServer } from "./app.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import path from 'path';

dotenv.config({
    path: "./.env"
})


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../../Frontend/QuickChat/dist")))

    app.get('/app/v1/', (req, res) => {
        res.sendFile(path.join(__dirname, "../Frontend", "QuickChat", "dist", "index.html"))
    })
}

connectDB()
    .then(() => {
        httpServer.on("error", (error) => {
            console.error("Server error:", error);
            process.exit(1);
        });

        const port = process.env.PORT || 8000;
        httpServer.listen(port, () => {
            console.log(`Server running on port ${port} 👍`);
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    });