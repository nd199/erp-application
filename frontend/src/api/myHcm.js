import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeLeaveRequests, fakeAttendance } from '../lib/fakeData'
import { mockList } from '../lib/mockApi'

const leaveStore = [...fakeLeaveRequests]
const attendanceStore = [...fakeAttendance]

export const myHcmAPI = {
  getMyLeaves: (params) => isDevMode()
    ? mockList(leaveStore, params)
    : api.get('/leave-requests/my', { params }),
  getMyAttendance: (params) => isDevMode()
    ? mockList(attendanceStore, params)
    : api.get('/attendance/my', { params }),
}
