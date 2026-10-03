import { createAsyncThunk } from '@reduxjs/toolkit'
import { attendanceAPI } from '../api/attendance'

const fetchAttendance = createAsyncThunk(
  'attendance/fetchAll',
  async (params) => {
    const { data } = await attendanceAPI.getAll(params)
    if (Array.isArray(data)) {
      const { page = 0, size = data.length, search = '', status = '', employeeId = '', date = '' } = params || {}
      let rows = [...data]
      if (search) {
        const q = search.toLowerCase()
        rows = rows.filter((a) =>
          `${a.employeeName} ${a.status}`.toLowerCase().includes(q)
        )
      }
      if (status) rows = rows.filter((a) => a.status === status)
      if (employeeId) rows = rows.filter((a) => a.employeeId === Number(employeeId))
      if (date) rows = rows.filter((a) => a.workDate === date)
      return { rows: rows.slice(page * size, page * size + size), total: rows.length }
    }
    return { rows: data.content, total: data.totalElements }
  }
)

const fetchAttendanceById = createAsyncThunk('attendance/fetchById', async (id) => {
  const { data } = await attendanceAPI.getById(id)
  return data
})

const createAttendance = createAsyncThunk('attendance/create', async (payload) => {
  const { data } = await attendanceAPI.create(payload)
  return data
})

const updateAttendance = createAsyncThunk('attendance/update', async ({ id, ...payload }) => {
  const { data } = await attendanceAPI.update(id, payload)
  return data
})

const deleteAttendance = createAsyncThunk('attendance/delete', async (id) => {
  await attendanceAPI.delete(id)
  return id
})

const searchAttendance = createAsyncThunk('attendance/search', async ({ keyword, params }) => {
  const { data } = await attendanceAPI.search(keyword, params)
  return data.content || data
})

export {
  fetchAttendance,
  fetchAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  searchAttendance,
}
