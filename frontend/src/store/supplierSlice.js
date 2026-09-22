import { createSlice } from '@reduxjs/toolkit'
import {
  fetchSuppliers,
  fetchSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from './supplierThunks'

const pending = (state) => {
  state.loading = true
  state.error = null
}
const rejected = (state, action) => {
  state.loading = false
  state.error = action.error.message
}

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState: {
    suppliers: [],
    currSupplier: null,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrSupplier: (state) => {
      state.currSupplier = null
    },
    clearSupplierErrors: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, pending)
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false
        state.suppliers = action.payload.rows
        state.total = action.payload.total
      })
      .addCase(fetchSuppliers.rejected, rejected)
      .addCase(fetchSupplierById.pending, pending)
      .addCase(fetchSupplierById.fulfilled, (state, action) => {
        state.loading = false
        state.currSupplier = action.payload
      })
      .addCase(fetchSupplierById.rejected, rejected)
      .addCase(createSupplier.pending, pending)
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.loading = false
        state.suppliers.push(action.payload)
        state.total += 1
      })
      .addCase(createSupplier.rejected, rejected)
      .addCase(updateSupplier.pending, pending)
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.loading = false
        state.suppliers = state.suppliers.map((s) =>
          s.id === action.payload.id ? action.payload : s
        )
      })
      .addCase(updateSupplier.rejected, rejected)
      .addCase(deleteSupplier.pending, pending)
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.loading = false
        state.suppliers = state.suppliers.filter((s) => s.id !== action.payload)
        state.total = Math.max(0, state.total - 1)
      })
      .addCase(deleteSupplier.rejected, rejected)
  },
})

export const { clearCurrSupplier, clearSupplierErrors } = supplierSlice.actions
export default supplierSlice.reducer
