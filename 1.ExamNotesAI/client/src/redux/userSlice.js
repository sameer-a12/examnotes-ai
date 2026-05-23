import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload

        },
        updateCredits: (state, action) => {
            if (state.userData) {
                state.userData.credits = action.payload
            }
        },
        updateStreak: (state, action) => {
            if (state.userData) {
                state.userData.streak = action.payload
            }
        },
    }

})


export const { setUserData, updateCredits, updateStreak } = userSlice.actions

export default userSlice.reducer