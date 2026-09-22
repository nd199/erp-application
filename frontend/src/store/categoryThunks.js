import { createAsyncThunk } from '@reduxjs/toolkit'
import { categoriesAPI } from '../api/categories'

const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (params) => {
    const { data } = await categoriesAPI.getAll(params)
    if (Array.isArray(data)) {
      const { page = 0, size = data.length, search = '' } = params || {}
      let rows = [...data]
      if (search) {
        const q = search.toLowerCase()
        rows = rows.filter((c) => `${c.name} ${c.description}`.toLowerCase().includes(q))
      }
      return { rows: rows.slice(page * size, page * size + size), total: rows.length }
    }
    return { rows: data.content, total: data.totalElements }
  }
)

const createCategory = createAsyncThunk(
  'categories/create',
  async (payload) => {
    const { data } = await categoriesAPI.create(payload)
    return data
  }
)

const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, ...payload }) => {
    const { data } = await categoriesAPI.update(id, payload)
    return data
  }
)

const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id) => {
    await categoriesAPI.delete(id)
    return id
  }
)

export { fetchCategories, createCategory, updateCategory, deleteCategory }
