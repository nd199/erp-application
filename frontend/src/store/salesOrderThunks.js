import { createAsyncThunk } from '@reduxjs/toolkit'
import { salesOrdersAPI } from '../api/salesOrders'

const fetchSalesOrders = createAsyncThunk(
  'salesOrders/fetchAll',
  async (params) => {
    const { data } = await salesOrdersAPI.getAll(params)
    if (Array.isArray(data)) {
      const { page = 0, size = data.length, search = '', status = '' } = params || {}
      let rows = [...data]
      if (search) {
        const q = search.toLowerCase()
        rows = rows.filter((o) =>
          `${o.userName} ${o.notes} ${o.status}`.toLowerCase().includes(q)
        )
      }
      if (status) rows = rows.filter((o) => o.status === status)
      return { rows: rows.slice(page * size, page * size + size), total: rows.length }
    }
    return { rows: data.content, total: data.totalElements }
  }
)

const fetchSalesOrderById = createAsyncThunk(
  'salesOrders/fetchById',
  async (id) => {
    const { data } = await salesOrdersAPI.getById(id)
    return data
  }
)

const createSalesOrder = createAsyncThunk(
  'salesOrders/create',
  async (payload) => {
    const { data } = await salesOrdersAPI.create(payload)
    return data
  }
)

const updateSalesOrderStatus = createAsyncThunk(
  'salesOrders/updateStatus',
  async ({ id, status }) => {
    const { data } = await salesOrdersAPI.updateStatus(id, status)
    return data
  }
)

const deleteSalesOrder = createAsyncThunk(
  'salesOrders/delete',
  async (id) => {
    await salesOrdersAPI.delete(id)
    return id
  }
)

export {
  fetchSalesOrders,
  fetchSalesOrderById,
  createSalesOrder,
  updateSalesOrderStatus,
  deleteSalesOrder,
}
