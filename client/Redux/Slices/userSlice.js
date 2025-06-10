import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    signupData: null,
    loading: false,
    userDetails: null,
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSignupData(state, action) {
            state.signupData = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setUserDetails(state, action) {
            state.userDetails = action.payload;
        },
    },
});


export const { setSignupData, setLoading, setUserDetails } = authSlice.actions;


export default authSlice.reducer;
