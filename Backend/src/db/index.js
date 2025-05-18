import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectDB = async () => {
    try {
        const conn_instance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log(conn_instance.connection.host);
    } catch (error) {
        console.log(" MongoDB Connection Error : ", error);
        process.exit(1)
    }
}

export default connectDB