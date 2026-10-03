import { createSlice } from '@reduxjs/toolkit'
import {
  fetchLeaves,
  fetchLeaveById,
  createLeave,
  updateLeave,
  deleteLeave,
  updateLeaveStatus,
  searchLeave,
} from './leaveThunks.js'

const pending = (state) => {
  state.loading = true
  state.error = null
}
const rejected = (state, action) => {
  state.loading = false
  state.error = action.error.message
}

const leaveSlice = createSlice({
  name: 'leaves',
  initialState: {
    leaves: [],
    currLeave: null,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrLeave: (state) => {
      state.currLeave = null
    },
    clearLeaveErrors: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, pending)
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false
        state.leaves = action.payload.rows
        state.total = action.payload.total
      })
      .addCase(fetchLeaves.rejected, rejected)
      .addCase(fetchLeaveById.pending, pending)
      .addCase(fetchLeaveById.fulfilled, (state, action) => {
        state.loading = false
        state.currLeave = action.payload
      })
      .addCase(fetchLeaveById.rejected, rejected)
      .addCase(createLeave.pending, pending)
      .addCase(createLeave.fulfilled, (state, action) => {
        state.loading = false
        state.leaves.push(action.payload)
        state.total += 1
      })
      .addCase(createLeave.rejected, rejected)
      .addCase(updateLeave.pending, pending)
      .addCase(updateLeave.fulfilled, (state, action) => {
        state.loading = false
        state.leaves = state.leaves.map((l) => (l.id === action.payload.id ? action.payload : l))
      })
      .addCase(updateLeave.rejected, rejected)
      .addCase(deleteLeave.pending, pending)
      .addCase(deleteLeave.fulfilled, (state, action) => {
        state.loading = false
        state.leaves = state.leaves.filter((l) => l.id !== action.payload)
        state.total = Math.max(0, state.total - 1)
      })
      .addCase(deleteLeave.rejected, rejected)
      .addCase(updateLeaveStatus.pending, pending)
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.loading = false
        state.leaves = state.leaves.map((l) => (l.id === action.payload.id ? action.payload : l))
      })
      .addCase(updateLeaveStatus.rejected, rejected)
      .addCase(searchLeave.pending, pending)
      .addCase(searchLeave.fulfilled, (state, action) => {
        state.loading = false
        state.leaves = action.payload
      })
      .addCase(searchLeave.rejected, rejected)
  },
})

export const { clearCurrLeave, clearLeaveErrors } = leaveSlice.actions
export default leaveSlice.reducer
