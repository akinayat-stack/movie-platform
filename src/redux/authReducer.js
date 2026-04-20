import { createSlice } from '@reduxjs/toolkit'

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    user: user ? JSON.parse(user) : null
  },
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    clearAuth: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})

export const { setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer
