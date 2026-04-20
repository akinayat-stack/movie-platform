import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authReducer'
import dataReducer from './dataReducer'

export const store = configureStore({
  reducer: {
    authReducer,
    dataReducer
  }
})
