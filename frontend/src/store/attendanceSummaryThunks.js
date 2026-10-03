import { createAsyncThunk } from '@reduxjs/toolkit'
import { attendanceSummaryAPI } from '../api/attendanceSummary'
import { myHcmAPI } from '../api/myHcm'

const fetchAttendanceSummaries = createAsyncThunk(
  'attendanceSummary/fetchAll',
  async (params) => {
    const { data } = await attendanceSummaryAPI.getAll(params)
    return Array.isArray(data) ? data : data.content || []
  }
)

const fetchMyAttendanceSummary = createAsyncThunk(
  'attendanceSummary/fetchMy',
  async (params) => {
    const { data } = await attendanceSummaryAPI.getMy(params)
    return data
  }
)

const fetchMyAttendance = createAsyncThunk(
  'attendanceSummary/fetchMyRecords',
  async (params) => {
    const { data } = await myHcmAPI.getMyAttendance(params)
    if (Array.isArray(data)) {
      const { fromDate = '', toDate = '', page = 0, size = data.length } = params || {}
      let rows = [...data]
      if (fromDate) rows = rows.filter((r) => r.workDate >= fromDate)
      if (toDate) rows = rows.filter((r) => r.workDate <= toDate)
      rows.sort((a, b) => String(b.workDate).localeCompare(String(a.workDate)))
      return { rows: rows.slice(page * size, page * size + size), total: rows.length }
    }
    return { rows: data.content, total: data.totalElements }
  }
)

export { fetchAttendanceSummaries, fetchMyAttendanceSummary, fetchMyAttendance }
