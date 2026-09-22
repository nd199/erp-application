import { createSlice } from '@reduxjs/toolkit'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from './categoryThunks'

const pending = (state) => { state.loading = true; state.error = null }
const rejected = (state, action) => { state.loading = false; state.error = action.error.message }

const categorySlice = createSlice({
  name: 'categories',
  initialState: { categories: [], total: 0, loading: false, error: null },
  reducers: { clearCategoryErrors: (state) => { state.error = null } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, pending)
      .addCase(fetchCategories.fulfilled, (state, action) => { state.loading = false; state.categories = action.payload.rows; state.total = action.payload.total })
      .addCase(fetchCategories.rejected, rejected)
      .addCase(createCategory.pending, pending)
      .addCase(createCategory.fulfilled, (state, action) => { state.loading = false; state.categories.push(action.payload); state.total += 1 })
      .addCase(createCategory.rejected, rejected)
      .addCase(updateCategory.pending, pending)
      .addCase(updateCategory.fulfilled, (state, action) => { state.loading = false; state.categories = state.categories.map((c) => c.id === action.payload.id ? action.payload : c) })
      .addCase(updateCategory.rejected, rejected)
      .addCase(deleteCategory.pending, pending)
      .addCase(deleteCategory.fulfilled, (state, action) => { state.loading = false; state.categories = state.categories.filter((c) => c.id !== action.payload); state.total = Math.max(0, state.total - 1) })
      .addCase(deleteCategory.rejected, rejected)
  },
})

export const { clearCategoryErrors } = categorySlice.actions
export default categorySlice.reducer
