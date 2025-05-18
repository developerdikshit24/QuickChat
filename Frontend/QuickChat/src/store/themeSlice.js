import { createSlice } from "@reduxjs/toolkit";
const savedBackground = localStorage.getItem('chatBackground') || ''
const InitialStage = {
    chatBackground: savedBackground,
    theme:""
}

const ThemeSlice = createSlice({
    name: "themes",
    initialState: InitialStage,
    reducers: {
        setChatBackground(state, action) {
            state.chatBackground = action.payload
            localStorage.setItem('chatBackground', action.payload)
        }
    }
})

export const { setChatBackground } = ThemeSlice.actions
export default ThemeSlice.reducer