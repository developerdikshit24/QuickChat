import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import http from "http"
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
export const httpServer = http.createServer(app)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({
    origin: `${process.env.CORS_ORIGIN}`,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
}))

app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(express.static("public/images"))
app.use(cookieParser())

// routes
import userRouter from "./routers/user.router.js"
import messageRouter from "./routers/message.route.js"
app.use("/api/v1/users", userRouter)
app.use("/api/v1/messages", messageRouter)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../../Frontend/QuickChat/dist")))

    // Handle client-side routing - only match routes that aren't API routes
    app.get('/*', (req, res) => {
        // Don't handle API routes here
        if (req.url.startsWith('/api/')) {
            return res.status(404).json({ error: 'API endpoint not found' });
        }
        res.sendFile(path.join(__dirname, "../../Frontend/QuickChat/dist/index.html"))
    })
}

export { app }