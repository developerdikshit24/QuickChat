import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { deleteFromCloud, uploadOnCloud } from "../utils/cloudnary.js"
import { User } from "../modules/user.module.js"
import { io } from "../utils/socket.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went worng while generate Access and Refresh Token")
    }
}
const getUser = asyncHandler(async (req, res) => {
    if (!req.user) throw new ApiError(400, "Invaild Access")
    const user = await User.findById(req.user._id).select("-password -refreshToken")
    if (!user) throw new ApiError(400, "User Not Found")
    return res.status(200).json(new ApiResponse(200, user, "User Fectch Successfully"))
})


const registerUser = asyncHandler(async (req, res) => {
    const { email, name, password, number } = req.body
    if ([email, name, password, number].some((field) => field.trim() == "")) {
        throw new ApiError(400, "All Fields Are Required")
    }
    if (!email.includes("@")) throw new ApiError(400, "Required validate email")

    const existedUser = await User.findOne({ $or: [{ email }, { number }] });
    if (existedUser) throw new ApiError(400, "User Already Existed")
    const profilePicture = req.file?.profilePicture?.[0]?.path;
    let profilePic;

    if (profilePicture) {
        profilePic = await uploadOnCloud(profilePicture, "image");
        if (!profilePic) throw new ApiError(400, "Profile Pictuer is Required");
    }

    const user = await User.create({
        name,
        email,
        password,
        number,
        ...(profilePic?.url && { profilePicture: profilePic.url })
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) throw new ApiError(500, "Something went wrong while registration");

    return res.status(200).json(
        new ApiResponse(200, createdUser, "User Register Successfully")
    );

})

const loginUser = asyncHandler(async (req, res) => {
    const { number, password } = req.body
    if (!number) throw new ApiError(400, "Mobile Number is Required")
    const user = await User.findOneAndUpdate({ number }, { $set: { status: "online" } }, { new: true })
    if (!user) throw new ApiError(400, "User doesnot exist")
    const isVaildPassword = await user.isPasswordCorrect(password)
    if (!isVaildPassword) throw new ApiError(400, "Invalid Credential")
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loginUser = await User.findById(user._id).select("-password -refreshToken")
    const options1 = {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
    }
    const options2 = {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 10 * 24 * 60 * 60 * 1000
    }
    return res.status(200)
        .cookie("accessToken", accessToken, options1)
        .cookie("refreshToken", refreshToken, options2)
        .json(new ApiResponse(200, { user: loginUser, refreshToken, accessToken }, "User Logged in Successfully"))

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 },
            $set: {
                status: "offline",
                lastSeen: new Date().toISOString()
             }
        },
        { new: true }
    )
    const options1 = {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
    }
    const options2 = {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 10 * 24 * 60 * 60 * 1000
    }
    return res.status(200)
        .clearCookie("accessToken", options1)
        .clearCookie("refreshToken", options2)
        .json(
            new ApiResponse(200, {}, "User logged Out")
        )
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { name, email, bio } = req.body
    if (!name && !email && !bio) throw new ApiError(400, "All field required")
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name,
                email,
                bio
            }
        },
        { new: true }
    ).select("-password -refreshToken")
    io.emit("profileUpdated", user)

    return res.status(200).json(new ApiResponse(200, user, "Data update successfully"))
})

const updateProfilePicture = asyncHandler(async (req, res) => {
    const pictuerLocalPath = req.file?.path

    if (!pictuerLocalPath) throw new ApiError(401, "Picture not found")

    const userId = await User.findById(req.user?._id)
    const oldPicture = userId.profilePicture

    const deleteOldPictuer = await deleteFromCloud(oldPicture, "image")
    if (!deleteOldPictuer) throw new ApiError(500, "Something went wrong while deleting Image")

    const pictuer = await uploadOnCloud(pictuerLocalPath, "image");
    if (!pictuer.url) throw new ApiError(400, "Something went wrong while upladting image")

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                profilePicture: pictuer.url
            }
        }, { new: true }
    ).select("-password -refreshToken")
    io.emit("profilePictuerUpdated", user)
    return res.status(200)
        .json(new ApiResponse(200, { user }, "Avatar update successfully"))
})

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const loggedUser = req.user._id;
        const filterdUsers = await User.find({ _id: { $ne: loggedUser} }).select("-password -refreshToken")
        return res.status(200)
            .json(new ApiResponse(200, filterdUsers, "User Fetch Successfully"));

    } catch (error) {
        return res.status(400)
            .json(new ApiError(400, "Something went wrong while getting users"))
    }
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingToken) {
        throw new ApiError(404, "Unauthorized Access")
    }
    try {
        const deCodedToken = jwt.verify(incomingToken,`${process.env.REFRESH_TOKEN_SECRET}`)
    
        const user = await User.findById(deCodedToken?.id)
        if (!user) {
            throw new ApiError(400, "Invaild access request")
        }
        
        if (incomingToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is Expired or Used")
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        const options1 = {
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000,
        }
        const options2 = {
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
            maxAge: 10 * 24 * 60 * 60 * 1000
        }
        res.status(200)
            .cookie("accessToken", accessToken, options1)
            .cookie("refreshToken", refreshToken, options2)
            .json(
                new ApiResponse(200,
                    {
                        accessToken,
                        refreshToken
                    },
                    "Access Refresh Successfully"
                )
            )
    } catch (error) {
        throw new ApiError(404, error?.message || "Invaild Access Token")
    }

}
)




export {
    registerUser,
    loginUser,
    logoutUser,
    updateAccountDetails,
    updateProfilePicture,
    getUser,
    getAllUsers,
    refreshAccessToken
}