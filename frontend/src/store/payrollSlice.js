import { createSlice } from '@reduxjs/toolkit'
import {
  fetchPayrollRuns,
  fetchPayrollRunById,
  createPayrollRun,
  updatePayrollRun,
  deletePayrollRun,
  processPayrollRun,
  markPayrollRunPaid,
  searchPayrollRun,
} from './payrollThunks.js'

const pending = (state) => {
  state.loading = true
  state.error = null
}
const rejected = (state, action) => {
  state.loading = false
  state.error = action.error.message
}

const payrollSlice = createSlice({
  name: 'payroll',
  initialState: {
    runs: [],
    currRun: null,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrRun: (state) => {
      state.currRun = null
    },
    clearPayrollErrors: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayrollRuns.pending, pending)
      .addCase(fetchPayrollRuns.fulfilled, (state, action) => {
        state.loading = false
        state.runs = action.payload.rows
        state.total = action.payload.total
      })
      .addCase(fetchPayrollRuns.rejected, rejected)
      .addCase(fetchPayrollRunById.pending, pending)
      .addCase(fetchPayrollRunById.fulfilled, (state, action) => {
        state.loading = false
        state.currRun = action.payload
      })
      .addCase(fetchPayrollRunById.rejected, rejected)
      .addCase(createPayrollRun.pending, pending)
      .addCase(createPayrollRun.fulfilled, (state, action) => {
        state.loading = false
        state.runs.push(action.payload)
        state.total += 1
      })
      .addCase(createPayrollRun.rejected, rejected)
      .addCase(updatePayrollRun.pending, pending)
      .addCase(updatePayrollRun.fulfilled, (state, action) => {
        state.loading = false
        state.runs = state.runs.map((r) => (r.id === action.payload.id ? action.payload : r))
      })
      .addCase(updatePayrollRun.rejected, rejected)
      .addCase(deletePayrollRun.pending, pending)
      .addCase(deletePayrollRun.fulfilled, (state, action) => {
        state.loading = false
        state.runs = state.runs.filter((r) => r.id !== action.payload)
        state.total = Math.max(0, state.total - 1)
      })
      .addCase(deletePayrollRun.rejected, rejected)
      .addCase(processPayrollRun.pending, pending)
      .addCase(processPayrollRun.fulfilled, (state, action) => {
        state.loading = false
        state.runs = state.runs.map((r) => (r.id === action.payload.id ? action.payload : r))
      })
      .addCase(processPayrollRun.rejected, rejected)
      .addCase(markPayrollRunPaid.pending, pending)
      .addCase(markPayrollRunPaid.fulfilled, (state, action) => {
        state.loading = false
        state.runs = state.runs.map((r) => (r.id === action.payload.id ? action.payload : r))
      })
      .addCase(markPayrollRunPaid.rejected, rejected)
      .addCase(searchPayrollRun.pending, pending)
      .addCase(searchPayrollRun.fulfilled, (state, action) => {
        state.loading = false
        state.runs = action.payload
      })
      .addCase(searchPayrollRun.rejected, rejected)
  },
})

export const { clearCurrRun, clearPayrollErrors } = payrollSlice.actions
export default payrollSlice.reducer
