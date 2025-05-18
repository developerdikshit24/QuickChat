import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js"
import selectReducer from "./ChatSlice.js"
import showSetting from "./settingPageSlice.js";
import Theme from "./themeSlice.js"
const store = configureStore({
    reducer: {
        auth: authReducer,
        Chat: selectReducer,
        showSettings: showSetting,
        theme:Theme
    },

})
export default store