import { createSlice } from '@reduxjs/toolkit'
import {
  fetchPurchaseOrders,
  fetchPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
  deletePurchaseOrder,
} from './purchaseOrderThunks'

const pending = (state) => {
  state.loading = true
  state.error = null
}
const rejected = (state, action) => {
  state.loading = false
  state.error = action.error.message
}

const purchaseOrderSlice = createSlice({
  name: 'purchaseOrders',
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
      .addCase(fetchPurchaseOrders.pending, pending)
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.rows
        state.total = action.payload.total
      })
      .addCase(fetchPurchaseOrders.rejected, rejected)
      .addCase(fetchPurchaseOrderById.pending, pending)
      .addCase(fetchPurchaseOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.currOrder = action.payload
      })
      .addCase(fetchPurchaseOrderById.rejected, rejected)
      .addCase(createPurchaseOrder.pending, pending)
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.loading = false
        state.orders.push(action.payload)
        state.total += 1
      })
      .addCase(createPurchaseOrder.rejected, rejected)
      .addCase(updatePurchaseOrderStatus.pending, pending)
      .addCase(updatePurchaseOrderStatus.fulfilled, (state, action) => {
        state.loading = false
        state.orders = state.orders.map((o) =>
          o.id === action.payload.id ? action.payload : o
        )
      })
      .addCase(updatePurchaseOrderStatus.rejected, rejected)
      .addCase(deletePurchaseOrder.pending, pending)
      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        state.loading = false
        state.orders = state.orders.filter((o) => o.id !== action.payload)
        state.total = Math.max(0, state.total - 1)
      })
      .addCase(deletePurchaseOrder.rejected, rejected)
  },
})

export const { clearCurrOrder, clearOrderErrors } = purchaseOrderSlice.actions
export default purchaseOrderSlice.reducer
