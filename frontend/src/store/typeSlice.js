import { createSlice } from '@reduxjs/toolkit'
import { fetchTypes, createType, updateType, deleteType } from './typeThunks'

const pending = (state) => { state.loading = true; state.error = null }
const rejected = (state, action) => { state.loading = false; state.error = action.error.message }

const typeSlice = createSlice({
  name: 'types',
  initialState: { types: [], total: 0, loading: false, error: null },
  reducers: { clearTypeErrors: (state) => { state.error = null } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypes.pending, pending)
      .addCase(fetchTypes.fulfilled, (state, action) => { state.loading = false; state.types = action.payload.rows; state.total = action.payload.total })
      .addCase(fetchTypes.rejected, rejected)
      .addCase(createType.pending, pending)
      .addCase(createType.fulfilled, (state, action) => { state.loading = false; state.types.push(action.payload); state.total += 1 })
      .addCase(createType.rejected, rejected)
      .addCase(updateType.pending, pending)
      .addCase(updateType.fulfilled, (state, action) => { state.loading = false; state.types = state.types.map((t) => t.id === action.payload.id ? action.payload : t) })
      .addCase(updateType.rejected, rejected)
      .addCase(deleteType.pending, pending)
      .addCase(deleteType.fulfilled, (state, action) => { state.loading = false; state.types = state.types.filter((t) => t.id !== action.payload); state.total = Math.max(0, state.total - 1) })
      .addCase(deleteType.rejected, rejected)
  },
})

export const { clearTypeErrors } = typeSlice.actions
export default typeSlice.reducer
