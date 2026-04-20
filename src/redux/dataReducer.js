import { createSlice } from '@reduxjs/toolkit'

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    categories: [],
    products: []
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    setProducts: (state, action) => {
      state.products = action.payload
    }
  }
})

export const { setCategories, setProducts } = dataSlice.actions
export default dataSlice.reducer
