import mongoose, { Schema } from "mongoose";
const messageSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        trim: true
    },
    media: {
        type: String,
    },
    status: {
        type: String,
        enum: ['sent', "delivered", "seen"],
        default: "sent"
    },
    deletedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

}, { timestamps: true }
)

messageSchema.index({ receiverId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema)

