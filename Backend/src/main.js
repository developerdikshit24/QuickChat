import './utils/socket.js';
import dotenv from "dotenv"
import connectDB from './db/index.js';
import { httpServer } from "./app.js";


dotenv.config({
    path: "./.env"
})



const requiredEnvVars = ['CORS_ORIGIN', 'PORT', 'MONGODB_URI'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`${envVar} is required in environment variables`);
    }
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