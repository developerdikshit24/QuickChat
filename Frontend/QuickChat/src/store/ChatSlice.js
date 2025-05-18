import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../Connection/axios";
import { socketInstance as socket } from "./authSlice";

export const getSideBarMsgThunk = createAsyncThunk('message/getSideBarMsg', async (_, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/messages/getSideBarMsg`)
        return res.data.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.messages || "Users Fetch Fail")
    }
})

export const getMsgThunk = createAsyncThunk('message/getMsg', async (userId, { dispatch, rejectWithValue }) => {
    try {
        const chat = await axiosInstance.get(`/messages/getUserChats/${userId}`)
        return chat.data.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.messages || "Msg Fetch Fail")
    }
})

export const sendMsgThunk = createAsyncThunk('message/sendMsg', async ({ user, data }, { dispatch, rejectWithValue }) => {
    try {
        const message = await axiosInstance.post(`/messages/sendMsg/${user}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return message.data.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.messages || "Msg not Send")
    }
})

export const getAllUserThunk = createAsyncThunk('auth/getAllUser', async (_, { rejectWithValue }) => {
    try {
        const allUser = await axiosInstance.get('/users/getAllUser');
        return allUser.data.data
    } catch (error) {
        return rejectWithValue(error)
, data    }
})

export const deletedMsgThunk = createAsyncThunk('auth/deleteChats', async (userId, { dispatch, rejectWithValue }) => {
    try {
        const deleteChats = await axiosInstance.get(`/messages/deleteChats/${userId}`);
        return deleteChats.data.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const listenMsg = () => (dispatch, getState) => {
    const { selectedUser } = getState().Chat
    if (!selectedUser) return;
    socket.on("newMessage", (newMessage) => {
        if (newMessage.senderId !== selectedUser._id) return;
        dispatch(addUserMsg(newMessage))
    })

}

export const offListenMsg = () => (dispatch, getState) => {
    socket.off("newMessgae")
}


const InitialStage = {
    selectedUser: null,
    messages: [],
    usersChat: [],
    allUsers: [],
    activeTab: 'Chat'
}

const ChatSlice = createSlice({
    name: "Chat",
    initialState: InitialStage,
    reducers: {

        activeTab(state, action) {
            state.activeTab = action.payload
        },

        updateMsgUsers(state, action) {
            state.messages = action.payload
        },

        addUserMsg(state, action) {
            state.usersChat.push(action.payload)
        },

        selectedUser(state, action) {
            state.selectedUser = action.payload
        },

        diselectChat(state) {
            state.selectedUser = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSideBarMsgThunk.fulfilled, (state, action) => {
                state.messages = action.payload
            })
            .addCase(getMsgThunk.fulfilled, (state, action) => {
                state.usersChat = action.payload
            })
            .addCase(sendMsgThunk.fulfilled, (state, action) => {
                state.usersChat.push(action.payload);
            })
            .addCase(getAllUserThunk.fulfilled, (state, action) => {
                state.allUsers = action.payload
            })
    }

})
export const { addUserMsg, diselectChat, selectedUser, updateMsgUsers, activeTab } = ChatSlice.actions
export default ChatSlice.reducer

