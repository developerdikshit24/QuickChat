import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { deleteFromCloud, uploadOnCloud } from "../utils/cloudnary.js"
import { Message } from "../modules/message.model.js"
import { User } from "../modules/user.module.js"
import { getReceiverSocketId, io } from "../utils/socket.js"
import axios from "axios"

const getSideBarMessages = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: userId, receiverId: { $ne: userId } },
                        { receiverId: userId, senderId: { $ne: userId } }
                    ]
                }
            },
            {
                $project: {
                    media: 1,
                    content: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    senderId: 1,
                    receiverId: 1,
                    otherUser: {
                        $cond: [
                            { $eq: ["$senderId", userId] },
                            "$receiverId",
                            "$senderId"
                        ]
                    }
                }
            },
            {
                $sort: { updatedAt: -1 }
            },
            {
                $group: {
                    _id: "$otherUser",
                    lastMessage: { $first: "$content" },
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $project: {
                    _id: "$userInfo._id",
                    name: "$userInfo.name",
                    email: "$userInfo.email",
                    number: "$userInfo.number",
                    profilePicture: "$userInfo.profilePicture",
                    isBlocked: "$userInfo.isBlocked",
                    lastSeen: "$userInfo.lastSeen",
                    status: "$userInfo.status",
                    lastMessage: "$userInfo.lastMessage",
                    updatedAt: "$userInfo.updatedAt"
                }
            },
        ]);

        return res
            .status(200)
            .json(new ApiResponse(200, messages, "Recent chat users with last messages"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, "Something went wrong"));
    }
});

const sentMessages = asyncHandler(async (req, res) => {
    try {
        let { content } = req.body;
        const { id: receiverId } = req.params;
        const isAIChat = receiverId === process.env.QUICKCHATAI_USERID;
        const senderId = req.user._id;
        const media = req.file?.path;

        if (media && isAIChat) {
            throw new ApiError(400, "You cannot send images to AI.");
        }

        let imageUrl;
        if (media) {
            const uploadMedia = await uploadOnCloud(media, "image");
            if (!uploadMedia) throw new ApiError(400, "Upload on Cloud fail");
            imageUrl = uploadMedia.url;
        }

        // ✅ 1. Save the user message first
        const newMessage = await Message.create({
            senderId,
            receiverId,
            content,
            media: imageUrl
        });

        if (!newMessage) throw new ApiError(400, "Failed to save message");

        await User.findByIdAndUpdate(senderId, content ? { lastMessage: content } : { lastMessage: "Image" });
        await User.findByIdAndUpdate(receiverId, content ? { lastMessage: content } : { lastMessage: "Image" });

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
            io.to(receiverSocketId).emit("getNewMsg");
        }
        io.to(senderId).emit("getNewMsg");

        res.status(200).json(new ApiResponse(200, newMessage, "Message sent successfully"));

        if (isAIChat && content) {
            const aiReply = await chatWithAi(content);

            const aiMessage = await Message.create({
                senderId: receiverId,
                receiverId: senderId,
                content: aiReply
            });

            if (aiMessage) {
                await User.findByIdAndUpdate(receiverId, { lastMessage: aiReply });
                await User.findByIdAndUpdate(senderId, { lastMessage: aiReply });

                const userSocketId = getReceiverSocketId(senderId);
                if (userSocketId) {
                    io.to(userSocketId).emit("newMessage", aiMessage);
                    io.to(userSocketId).emit("getNewMsg");
                }
            }
        }

    } catch (error) {
        console.error("Message error:", error);
        return res.status(500).json(new ApiError(500, error));
    }
});


const getUserChats = asyncHandler(async (req, res) => {
    const { id } = req.params
    const LoggedUser = req.user._id
    if (!id) throw new ApiError(400, "User not get")
    const getChat = await Message.find({
        $or: [
            { senderId: id, receiverId: LoggedUser },
            { receiverId: id, senderId: LoggedUser }
        ],
        deletedBy: { $ne: LoggedUser } 
    }).sort({ createdAt: 1 }).lean()

    if (!getChat) throw new ApiError(400, "Chat Not Found")

    return res.status(200).json(new ApiResponse(200, getChat, "Chat Fetched"))
});

const getSelectedUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) throw new ApiError(400, "User not get it")
        const getUser = await User.findById(id).select("-password -refreshToken")

        if (!getUser) throw new ApiError(400, "User not found")
        return res.status(200)
            .json(new ApiResponse(200, getUser, "User Fetch Successfully"))
    } catch (error) {
        throw new ApiError(500, "Internal Server Error")
    }
});

const deleteChats = asyncHandler(async (req, res) => {
    try {
        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        if (!(senderId || receiverId)) throw new ApiError(400, "unAuthorized Access");
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })

        const messagesToKeep = [];
        const messagesToDelete = [];

        for (let msg of messages) {
            if (msg.deletedBy.includes(senderId)) continue; 

            msg.deletedBy.push(senderId);

            const bothDeleted = msg.deletedBy.includes(senderId.toString()) &&(receiverId === process.env.QUICKCHATAI_USERID || msg.deletedBy.includes(receiverId.toString()));

            if (bothDeleted) {
                messagesToDelete.push(msg._id);
            } else {
                messagesToKeep.push(msg);
            }
        }

        await Promise.all(messagesToKeep.map(m => m.save()));

        if (messagesToDelete.length) {
            for (const msg of messagesToDelete) {
                const message = await Message.findById(msg)
                if (message.media && message.media.length > 0) {
                    console.log("Deleting media for message:", message._id);
                    const cloudRes = await deleteFromCloud(message.media, 'image');
                    if(!cloudRes) throw new ApiError(400, {}, "Internal Server Error")
                }
            }
            await Message.deleteMany({ _id: { $in: messagesToDelete } });
        }

        await User.findByIdAndUpdate(receiverId, { lastMessage: "" });

        const senderSocketId = getReceiverSocketId(senderId);
        
        io.to(senderSocketId).emit("chatDeleted", receiverId);

        return res.status(200).json(new ApiResponse(200, {}, "Messages deleted from your view"));
    } catch (error) {
        return res.status(400).json(new ApiError(400, "Error"));
    }
})

const chatWithAi = async (content) => {

    try {
        const response = await axios.post(
            process.env.QUICK_URL,
            {
                model: 'meta-llama/Llama-3-8b-chat-hf',
                messages: [{ role: 'user', content: content }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.QUICK_AI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("AI Error:", error.response?.data || error.message);
        return "Sorry, I couldn't generate a response.";
    }

}



export {
    sentMessages,
    getSideBarMessages,
    getUserChats,
    getSelectedUser,
    deleteChats,
    chatWithAi
}