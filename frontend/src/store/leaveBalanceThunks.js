import { createAsyncThunk } from '@reduxjs/toolkit'
import { leaveBalancesAPI } from '../api/leaveBalances'
import { myHcmAPI } from '../api/myHcm'

const fetchLeaveBalances = createAsyncThunk(
  'leaveBalances/fetchAll',
  async (params) => {
    const { data } = await leaveBalancesAPI.getAll(params)
    if (Array.isArray(data)) {
      const { year = '', leaveType = '', employeeId = '', search = '' } = params || {}
      let rows = [...data]
      if (year) rows = rows.filter((r) => r.year === Number(year))
      if (leaveType) rows = rows.filter((r) => r.leaveType === leaveType)
      if (employeeId) rows = rows.filter((r) => r.employeeId === Number(employeeId))
      if (search) {
        const q = search.toLowerCase()
        rows = rows.filter((r) =>
          `${r.employeeName} ${r.employeeEmail} ${r.leaveType}`.toLowerCase().includes(q)
        )
      }
      return { rows, total: rows.length }
    }
    return { rows: data.content, total: data.totalElements }
  }
)

const createLeaveBalance = createAsyncThunk('leaveBalances/create', async (payload) => {
  const { data } = await leaveBalancesAPI.create(payload)
  return data
})

const updateLeaveBalance = createAsyncThunk(
  'leaveBalances/update',
  async ({ id, ...payload }) => {
    const { data } = await leaveBalancesAPI.update(id, payload)
    return data
  }
)

const deleteLeaveBalance = createAsyncThunk('leaveBalances/delete', async (id) => {
  await leaveBalancesAPI.delete(id)
  return id
})

const fetchMyLeaves = createAsyncThunk(
  'leaveBalances/fetchMyLeaves',
  async (params) => {
    const { data } = await myHcmAPI.getMyLeaves(params)
    if (Array.isArray(data)) {
      const { page = 0, size = data.length, search = '', status = '' } = params || {}
      let rows = [...data]
      if (search) {
        const q = search.toLowerCase()
        rows = rows.filter((l) =>
          `${l.employeeName} ${l.leaveType} ${l.reason}`.toLowerCase().includes(q)
        )
      }
      if (status) rows = rows.filter((l) => l.status === status)
      return { rows: rows.slice(page * size, page * size + size), total: rows.length }
    }
    return { rows: data.content, total: data.totalElements }
  }
)

export {
  fetchLeaveBalances,
  createLeaveBalance,
  updateLeaveBalance,
  deleteLeaveBalance,
  fetchMyLeaves,
}
