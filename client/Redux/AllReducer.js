import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "../Redux/Slices/userSlice"

const totalReducer = combineReducers({
    auth: authReducer
})

export default totalReducer;