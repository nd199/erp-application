import { createAsyncThunk } from '@reduxjs/toolkit'
import { typesAPI } from '../api/types'

const fetchTypes = createAsyncThunk(
  'types/fetchAll',
  async (params) => {
    const { data } = await typesAPI.getAll(params)
    if (Array.isArray(data)) {
      const { page = 0, size = data.length, search = '' } = params || {}
      let rows = [...data]
      if (search) {
        const q = search.toLowerCase()
        rows = rows.filter((t) => `${t.name} ${t.description}`.toLowerCase().includes(q))
      }
      return { rows: rows.slice(page * size, page * size + size), total: rows.length }
    }
    return { rows: data.content, total: data.totalElements }
  }
)

const createType = createAsyncThunk(
  'types/create',
  async (payload) => {
    const { data } = await typesAPI.create(payload)
    return data
  }
)

const updateType = createAsyncThunk(
  'types/update',
  async ({ id, ...payload }) => {
    const { data } = await typesAPI.update(id, payload)
    return data
  }
)

const deleteType = createAsyncThunk(
  'types/delete',
  async (id) => {
    await typesAPI.delete(id)
    return id
  }
)

export { fetchTypes, createType, updateType, deleteType }
