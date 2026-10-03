import { createSlice } from '@reduxjs/toolkit'
import { fetchPayslipsByRun, fetchPayslipDetail, fetchMyPayslips } from './payslipThunks.js'

const pending = (state) => {
  state.loading = true
  state.error = null
}
const rejected = (state, action) => {
  state.loading = false
  state.error = action.error.message
}

const payslipSlice = createSlice({
  name: 'payslips',
  initialState: {
    payslips: [],
    myPayslips: [],
    currPayslip: null,
    total: 0,
    myTotal: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrPayslip: (state) => {
      state.currPayslip = null
    },
    clearPayslipErrors: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayslipsByRun.pending, pending)
      .addCase(fetchPayslipsByRun.fulfilled, (state, action) => {
        state.loading = false
        state.payslips = action.payload
        state.total = action.payload.length
      })
      .addCase(fetchPayslipsByRun.rejected, rejected)
      .addCase(fetchPayslipDetail.pending, pending)
      .addCase(fetchPayslipDetail.fulfilled, (state, action) => {
        state.loading = false
        state.currPayslip = action.payload
      })
      .addCase(fetchPayslipDetail.rejected, rejected)
      .addCase(fetchMyPayslips.pending, pending)
      .addCase(fetchMyPayslips.fulfilled, (state, action) => {
        state.loading = false
        state.myPayslips = action.payload.rows
        state.myTotal = action.payload.total
      })
      .addCase(fetchMyPayslips.rejected, rejected)
  },
})

export const { clearCurrPayslip, clearPayslipErrors } = payslipSlice.actions
export default payslipSlice.reducer
