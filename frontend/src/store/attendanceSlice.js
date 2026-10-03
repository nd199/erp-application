import { createSlice } from '@reduxjs/toolkit'
import {
  fetchAttendance,
  fetchAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  searchAttendance,
} from './attendanceThunks.js'

const pending = (state) => {
  state.loading = true
  state.error = null
}
const rejected = (state, action) => {
  state.loading = false
  state.error = action.error.message
}

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    records: [],
    currRecord: null,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrRecord: (state) => {
      state.currRecord = null
    },
    clearAttendanceErrors: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, pending)
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.records = action.payload.rows
        state.total = action.payload.total
      })
      .addCase(fetchAttendance.rejected, rejected)
      .addCase(fetchAttendanceById.pending, pending)
      .addCase(fetchAttendanceById.fulfilled, (state, action) => {
        state.loading = false
        state.currRecord = action.payload
      })
      .addCase(fetchAttendanceById.rejected, rejected)
      .addCase(createAttendance.pending, pending)
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.records.push(action.payload)
        state.total += 1
      })
      .addCase(createAttendance.rejected, rejected)
      .addCase(updateAttendance.pending, pending)
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.records = state.records.map((r) => (r.id === action.payload.id ? action.payload : r))
      })
      .addCase(updateAttendance.rejected, rejected)
      .addCase(deleteAttendance.pending, pending)
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.records = state.records.filter((r) => r.id !== action.payload)
        state.total = Math.max(0, state.total - 1)
      })
      .addCase(deleteAttendance.rejected, rejected)
      .addCase(searchAttendance.pending, pending)
      .addCase(searchAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.records = action.payload
      })
      .addCase(searchAttendance.rejected, rejected)
  },
})

export const { clearCurrRecord, clearAttendanceErrors } = attendanceSlice.actions
export default attendanceSlice.reducer
