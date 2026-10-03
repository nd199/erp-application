import { createSlice } from '@reduxjs/toolkit'
import {
  fetchLeaveBalances,
  createLeaveBalance,
  updateLeaveBalance,
  deleteLeaveBalance,
  fetchMyLeaves,
} from './leaveBalanceThunks.js'

const pending = (state) => {
  state.loading = true
  state.error = null
}
const rejected = (state, action) => {
  state.loading = false
  state.error = action.error.message
}

const leaveBalanceSlice = createSlice({
  name: 'leaveBalances',
  initialState: {
    balances: [],
    myLeaves: [],
    total: 0,
    myLeavesTotal: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearLeaveBalanceErrors: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveBalances.pending, pending)
      .addCase(fetchLeaveBalances.fulfilled, (state, action) => {
        state.loading = false
        state.balances = action.payload.rows
        state.total = action.payload.total
      })
      .addCase(fetchLeaveBalances.rejected, rejected)
      .addCase(createLeaveBalance.pending, pending)
      .addCase(createLeaveBalance.fulfilled, (state, action) => {
        state.loading = false
        state.balances.push(action.payload)
        state.total += 1
      })
      .addCase(createLeaveBalance.rejected, rejected)
      .addCase(updateLeaveBalance.pending, pending)
      .addCase(updateLeaveBalance.fulfilled, (state, action) => {
        state.loading = false
        state.balances = state.balances.map((b) =>
          b.id === action.payload.id ? action.payload : b
        )
      })
      .addCase(updateLeaveBalance.rejected, rejected)
      .addCase(deleteLeaveBalance.pending, pending)
      .addCase(deleteLeaveBalance.fulfilled, (state, action) => {
        state.loading = false
        state.balances = state.balances.filter((b) => b.id !== action.payload)
        state.total = Math.max(0, state.total - 1)
      })
      .addCase(deleteLeaveBalance.rejected, rejected)
      .addCase(fetchMyLeaves.pending, pending)
      .addCase(fetchMyLeaves.fulfilled, (state, action) => {
        state.loading = false
        state.myLeaves = action.payload.rows
        state.myLeavesTotal = action.payload.total
      })
      .addCase(fetchMyLeaves.rejected, rejected)
  },
})

export const { clearLeaveBalanceErrors } = leaveBalanceSlice.actions
export default leaveBalanceSlice.reducer
