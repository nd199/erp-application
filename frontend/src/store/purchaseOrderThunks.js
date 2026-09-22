import { createAsyncThunk } from '@reduxjs/toolkit'
import { purchaseOrdersAPI } from '../api/purchaseOrders'

const fetchPurchaseOrders = createAsyncThunk(
  'purchaseOrders/fetchAll',
  async (params) => {
    const { data } = await purchaseOrdersAPI.getAll(params)
    if (Array.isArray(data)) {
      const { page = 0, size = data.length, search = '', status = '' } = params || {}
      let rows = [...data]
      if (search) {
        const q = search.toLowerCase()
        rows = rows.filter((o) =>
          `${o.supplierName} ${o.notes} ${o.status}`.toLowerCase().includes(q)
        )
      }
      if (status) rows = rows.filter((o) => o.status === status)
      return { rows: rows.slice(page * size, page * size + size), total: rows.length }
    }
    return { rows: data.content, total: data.totalElements }
  }
)

const fetchPurchaseOrderById = createAsyncThunk(
  'purchaseOrders/fetchById',
  async (id) => {
    const { data } = await purchaseOrdersAPI.getById(id)
    return data
  }
)

const createPurchaseOrder = createAsyncThunk(
  'purchaseOrders/create',
  async (payload) => {
    const { data } = await purchaseOrdersAPI.create(payload)
    return data
  }
)

const updatePurchaseOrderStatus = createAsyncThunk(
  'purchaseOrders/updateStatus',
  async ({ id, status }) => {
    const { data } = await purchaseOrdersAPI.updateStatus(id, status)
    return data
  }
)

const deletePurchaseOrder = createAsyncThunk(
  'purchaseOrders/delete',
  async (id) => {
    await purchaseOrdersAPI.delete(id)
    return id
  }
)

export {
  fetchPurchaseOrders,
  fetchPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
  deletePurchaseOrder,
}
