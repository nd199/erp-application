import { createAsyncThunk } from '@reduxjs/toolkit'
import { suppliersAPI } from '../api/suppliers'

const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchAll',
  async (params) => {
    const { data } = await suppliersAPI.getAll(params)
    if (Array.isArray(data)) {
      const { page = 0, size = data.length, search = '' } = params || {}
      let rows = [...data]
      if (search) {
        const q = search.toLowerCase()
        rows = rows.filter((s) =>
          `${s.name} ${s.contactPerson} ${s.email}`.toLowerCase().includes(q)
        )
      }
      return { rows: rows.slice(page * size, page * size + size), total: rows.length }
    }
    return { rows: data.content, total: data.totalElements }
  }
)

const fetchSupplierById = createAsyncThunk(
  'suppliers/fetchById',
  async (id) => {
    const { data } = await suppliersAPI.getById(id)
    return data
  }
)

const createSupplier = createAsyncThunk(
  'suppliers/create',
  async (payload) => {
    const { data } = await suppliersAPI.create(payload)
    return data
  }
)

const updateSupplier = createAsyncThunk(
  'suppliers/update',
  async ({ id, ...payload }) => {
    const { data } = await suppliersAPI.update(id, payload)
    return data
  }
)

const deleteSupplier = createAsyncThunk(
  'suppliers/delete',
  async (id) => {
    await suppliersAPI.delete(id)
    return id
  }
)

export {
  fetchSuppliers,
  fetchSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
}
