import { createSlice } from '@reduxjs/toolkit'
import {
  fetchSalesOrders,
  fetchSalesOrderById,
  createSalesOrder,
  updateSalesOrderStatus,
  deleteSalesOrder,
} from './salesOrderThunks'

const pending = (state) => {
  state.loading = true
  state.error = null
}
const rejected = (state, action) => {
  state.loading = false
  state.error = action.error.message
}

const salesOrderSlice = createSlice({
  name: 'salesOrders',
  initialState: {
    orders: [],
    currOrder: null,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrOrder: (state) => {
      state.currOrder = null
    },
    clearOrderErrors: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesOrders.pending, pending)
      .addCase(fetchSalesOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.rows
        state.total = action.payload.total
      })
      .addCase(fetchSalesOrders.rejected, rejected)
      .addCase(fetchSalesOrderById.pending, pending)
      .addCase(fetchSalesOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.currOrder = action.payload
      })
      .addCase(fetchSalesOrderById.rejected, rejected)
      .addCase(createSalesOrder.pending, pending)
      .addCase(createSalesOrder.fulfilled, (state, action) => {
        state.loading = false
        state.orders.push(action.payload)
        state.total += 1
      })
      .addCase(createSalesOrder.rejected, rejected)
      .addCase(updateSalesOrderStatus.pending, pending)
      .addCase(updateSalesOrderStatus.fulfilled, (state, action) => {
        state.loading = false
        state.orders = state.orders.map((o) =>
          o.id === action.payload.id ? action.payload : o
        )
      })
      .addCase(updateSalesOrderStatus.rejected, rejected)
      .addCase(deleteSalesOrder.pending, pending)
      .addCase(deleteSalesOrder.fulfilled, (state, action) => {
        state.loading = false
        state.orders = state.orders.filter((o) => o.id !== action.payload)
        state.total = Math.max(0, state.total - 1)
      })
      .addCase(deleteSalesOrder.rejected, rejected)
  },
})

export const { clearCurrOrder, clearOrderErrors } = salesOrderSlice.actions
export default salesOrderSlice.reducer
