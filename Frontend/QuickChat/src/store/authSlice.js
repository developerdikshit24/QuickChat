import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../Connection/axios.js";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { getMsgThunk, getSideBarMsgThunk, updateMsgUsers } from "./ChatSlice.js";
import { extractErrorMessage } from "../constant.js";
export let socketInstance = null
const BASE_URL = import.meta.env.DEV
    ? import.meta.env.VITE_API_URL
    : "/";



export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get("/users/getUser");
        dispatch(connectSocketThunk(res.data.data._id));
        return res.data.data;
    } catch (err) {
        return rejectWithValue(extractErrorMessage(err.response.data) || 'Auth check failed');
    }
});


export const registerThunk = createAsyncThunk('auth/register', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/users/register", data);
        toast.success("Account created successfully");
        dispatch(connectSocketThunk(res.data.data._id));
        return res.data.data;
    } catch (err) {
        toast.error(extractErrorMessage(err.response.data) || 'Registration failed');
        return rejectWithValue(extractErrorMessage(err.response.data) || 'Registration failed');
    }
});

export const loginThunk = createAsyncThunk('auth/login', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/users/login", data);
        toast.success("Logged in successfully");
        dispatch(connectSocketThunk(res.data.data.user._id));
        return res.data.data;
    } catch (err) {
        toast.error(extractErrorMessage(err.response.data) || 'Login failed');
        return rejectWithValue(extractErrorMessage(err.response.data) || 'Login failed');
    }
});


export const logoutThunk = createAsyncThunk('auth/logout', async (_, { dispatch, rejectWithValue }) => {
    try {
        await axiosInstance.post("/users/logout");
        dispatch(disconnectSocketThunk())
        toast.success("Logged out successfully");
        return true;
    } catch (err) {
        toast.error(extractErrorMessage(err.response.data) || 'Logout failed');
        return rejectWithValue(extractErrorMessage(err.response.data) || 'Logout failed');
    }
});


export const updateProfilePictureThunk = createAsyncThunk('auth/updateProfilePicture', async (file, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/users/updateProfilePic", file, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Profile picture updated");
        return res.data.data.user;
    } catch (err) {
        toast.error(extractErrorMessage(err.response.data) || 'Update profile pic failed');
        return rejectWithValue(extractErrorMessage(err.response.data) || 'Update profile pic failed');
    }
});

export const updateDetailsThunk = createAsyncThunk('auth/updateDetails', async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/users/updateAccount", data);
        toast.success("Account details updated");
        return res.data.data;
    } catch (err) {
        toast.error(extractErrorMessage(err.response.data) || 'Update account failed');
        return rejectWithValue(extractErrorMessage(err.response.data) || 'Update account failed');
    }
});




export const connectSocketThunk = (userId) => (dispatch, getState) => {

    if (!userId || (socketInstance && socketInstance.connected)) return;

    const newSocket = io(BASE_URL, {
        query: { userId }
    });

    socketInstance = newSocket;
    newSocket.on("connect", () => {
        dispatch(connectSocket({ socketId: newSocket.id }));
    });

    newSocket.on("getOnlineUsers", (userIds) => {
        dispatch(setOnlineUsers(userIds));
    });

    newSocket.on('profilePictuerUpdated', (data) => {
        const msg = getState().Chat.messages
        const Msgdata = msg.map(item => item._id === data._id ? { ...item, profilePicture: data.profilePicture } : item)
        dispatch(updateMsgUsers(Msgdata))
    })

    newSocket.on('profileUpdated', (data) => {
        const msg = getState().Chat.messages
        const Msgdata = msg.map(item => item._id === data._id ? { ...item, name: data.name, bio: data.bio } : item)
        dispatch(updateMsgUsers(Msgdata))
    })

    newSocket.on("getNewMsg", () => {
        dispatch(getSideBarMsgThunk())
    })

    newSocket.on("chatDeleted", (userId) => {
        const { selectedUser } = getState().Chat;
        if (selectedUser && selectedUser._id === userId) {
            dispatch(getMsgThunk(userId));
        }
        dispatch(getSideBarMsgThunk());
    });

};


export const disconnectSocketThunk = () => (dispatch) => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
    dispatch(disconnectSocket());
};


const InitialState = {
    success: false,
    userData: null,
    checkAuth: true,
    socketId: null,
    onlineUsers: [],
    isUpdatingProfile: false,
    isAuthenticating: false
};

const authSlice = createSlice({
    name: "auth",
    initialState: InitialState,
    reducers: {
        connectSocket(state, action) {
            state.socketId = action.payload.socketId;
        },
        disconnectSocket(state) {
            state.socketId = null;
            state.onlineUsers = [];
        },
        setOnlineUsers(state, action) {
            state.onlineUsers = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.checkAuth = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.userData = action.payload;
                state.success = true;
                state.checkAuth = false;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.userData = null;
                state.success = false;
                state.checkAuth = false;
            })

            .addCase(loginThunk.pending, (state, action) => {
                state.isAuthenticating = true
            })
            
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.success = true;
                state.userData = action.payload;
                state.isAuthenticating = false
            })

            .addCase(loginThunk.rejected, (state, action) => {
                state.isAuthenticating = false
            })

            .addCase(registerThunk.pending, (state, action) => {
                state.isAuthenticating = true
            })
            
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.userData = action.payload;
                state.success = true;
                state.isAuthenticating = false
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.isAuthenticating = false
            })

            .addCase(logoutThunk.fulfilled, (state) => {
                state.userData = null;
                state.success = false;
            })

            .addCase(updateProfilePictureThunk.fulfilled, (state, action) => {
                state.userData = action.payload;
            })

            .addCase(updateDetailsThunk.fulfilled, (state, action) => {
                state.userData = action.payload;
            })

    }
});

export const { connectSocket, setUpdatedUserData, disconnectSocket, setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;
