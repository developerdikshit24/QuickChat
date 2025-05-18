import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import http from "http"


const app = express();
export const httpServer = http.createServer(app)


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



export { app }