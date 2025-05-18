import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    number: {
        type: String,
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        default: "Hey! I'm using QuickChat",
    },

    profilePicture: {
        type: String,
        default: "https://res.cloudinary.com/dcehtpeqy/image/upload/v1745830813/nspjjtm5udb4vbgx5wen.jpg",
    },
    status: {
        type: String,
        enum: ["online", "offline"],
        default: "offline",
    },
    lastMessage: {
        type: String,
    },
    lastSeen: {
        type: Date,
        default: Date.now,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    }

}, { timestamps: true });
 

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 10);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        id: this._id,
        email: this.email,
        name: this.name,
    }, process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPAIRY,
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        id: this._id,

    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPAIRY,
        }
    )
}

export const User = mongoose.model("User", userSchema);