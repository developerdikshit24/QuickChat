import { createSlice } from "@reduxjs/toolkit";

const InitialStage = {
    showSetting: false,
    settingPage: null
}

const showSettingSlice = createSlice({
    name: "showSettings",
    initialState: InitialStage,
    reducers: {
        showSetting(state, action) {
            state.showSetting = true,
                state.settingPage = action.payload
        },
        hideSetting(state) {
            state.showSetting = false,
                state.settingPage=null
         }
    }
})

export const { showSetting, hideSetting } = showSettingSlice.actions
export default showSettingSlice.reducer