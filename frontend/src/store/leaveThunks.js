import { createAsyncThunk } from '@reduxjs/toolkit'
import { leavesAPI } from '../api/leaves'

const fetchLeaves = createAsyncThunk(
  'leaves/fetchAll',
  async (params) => {
    const { data } = await leavesAPI.getAll(params)
    if (Array.isArray(data)) {
      const { page = 0, size = data.length, search = '', status = '', employeeId = '' } = params || {}
      let rows = [...data]
      if (search) {
        const q = search.toLowerCase()
        rows = rows.filter((l) =>
          `${l.employeeName} ${l.leaveType} ${l.reason}`.toLowerCase().includes(q)
        )
      }
      if (status) rows = rows.filter((l) => l.status === status)
      if (employeeId) rows = rows.filter((l) => l.employeeId === Number(employeeId))
      return { rows: rows.slice(page * size, page * size + size), total: rows.length }
    }
    return { rows: data.content, total: data.totalElements }
  }
)

const fetchLeaveById = createAsyncThunk('leaves/fetchById', async (id) => {
  const { data } = await leavesAPI.getById(id)
  return data
})

const createLeave = createAsyncThunk('leaves/create', async (payload) => {
  const { data } = await leavesAPI.create(payload)
  return data
})

const updateLeave = createAsyncThunk('leaves/update', async ({ id, ...payload }) => {
  const { data } = await leavesAPI.update(id, payload)
  return data
})

const deleteLeave = createAsyncThunk('leaves/delete', async (id) => {
  await leavesAPI.delete(id)
  return id
})

const updateLeaveStatus = createAsyncThunk('leaves/updateStatus', async ({ id, status, approvalNotes }) => {
  const { data } = await leavesAPI.updateStatus(id, { status, approvalNotes })
  return data
})

const searchLeave = createAsyncThunk('leaves/search', async ({ keyword, params }) => {
  const { data } = await leavesAPI.search(keyword, params)
  return data.content || data
})

export {
  fetchLeaves,
  fetchLeaveById,
  createLeave,
  updateLeave,
  deleteLeave,
  updateLeaveStatus,
  searchLeave,
}
