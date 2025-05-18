import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import {
    registerUser,
    loginUser,
    logoutUser,
    updateAccountDetails,
    updateProfilePicture,
    getUser,
    getAllUsers,
    refreshAccessToken
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router()
router.route("/register").post(
    upload.single("profilePicture"),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/updateAccount").post(verifyJWT, updateAccountDetails)
router.route("/updateProfilePic").post(verifyJWT, upload.single("profilePicture"), updateProfilePicture)
router.route("/getUser").get(verifyJWT, getUser)
router.route("/getAllUser").get(verifyJWT, getAllUsers)
router.route("/refreshAccessToken").post(refreshAccessToken)
export default router