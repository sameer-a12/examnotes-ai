import { createSlice } from '@reduxjs/toolkit'

const saved = localStorage.getItem('adminData')
const initialState = {
  adminData: saved ? JSON.parse(saved) : null,
}
 
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminData: (state, action) => {
      state.adminData = action.payload
      localStorage.setItem('adminData', JSON.stringify(action.payload))
    },
    clearAdminData: (state) => {
      state.adminData = null
      localStorage.removeItem('adminData')
    },
  },
})
 
export const { setAdminData, clearAdminData } = adminSlice.actions
export default adminSlice.reducer