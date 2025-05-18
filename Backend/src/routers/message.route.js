import { Router } from "express";
import {
    sentMessages,
    getSideBarMessages,
    getUserChats,
    getSelectedUser,
    deleteChats,
    chatWithAi
} from "../controllers/message.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()
router.route("/sendMsg/:id").post(verifyJWT, upload.single("media"), sentMessages)
router.route("/getSideBarMsg").get(verifyJWT, getSideBarMessages)
router.route("/getUserChats/:id").get(verifyJWT, getUserChats)
router.route("/getSelectedUser/:id").get(verifyJWT, getSelectedUser)
router.route("/chatWithAi").get(verifyJWT, chatWithAi)
router.route("/deleteChats/:id").get(verifyJWT, deleteChats)

export default router