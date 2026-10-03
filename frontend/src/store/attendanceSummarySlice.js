import { createSlice } from '@reduxjs/toolkit'
import {
  fetchAttendanceSummaries,
  fetchMyAttendanceSummary,
  fetchMyAttendance,
} from './attendanceSummaryThunks.js'

const pending = (state) => {
  state.loading = true
  state.error = null
}
const rejected = (state, action) => {
  state.loading = false
  state.error = action.error.message
}

const attendanceSummarySlice = createSlice({
  name: 'attendanceSummary',
  initialState: {
    summaries: [],
    mySummary: null,
    myRecords: [],
    myTotal: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearAttendanceSummaryErrors: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceSummaries.pending, pending)
      .addCase(fetchAttendanceSummaries.fulfilled, (state, action) => {
        state.loading = false
        state.summaries = action.payload
      })
      .addCase(fetchAttendanceSummaries.rejected, rejected)
      .addCase(fetchMyAttendanceSummary.pending, pending)
      .addCase(fetchMyAttendanceSummary.fulfilled, (state, action) => {
        state.loading = false
        state.mySummary = action.payload
      })
      .addCase(fetchMyAttendanceSummary.rejected, rejected)
      .addCase(fetchMyAttendance.pending, pending)
      .addCase(fetchMyAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.myRecords = action.payload.rows
        state.myTotal = action.payload.total
      })
      .addCase(fetchMyAttendance.rejected, rejected)
  },
})

export const { clearAttendanceSummaryErrors } = attendanceSummarySlice.actions
export default attendanceSummarySlice.reducer
