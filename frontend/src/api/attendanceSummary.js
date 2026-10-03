import api from './axios'
import { isDevMode } from '../lib/devMode'
import { fakeAttendanceSummary } from '../lib/fakeData'
import { mockList } from '../lib/mockApi'

export const attendanceSummaryAPI = {
  getAll: (params) => isDevMode()
    ? mockList([fakeAttendanceSummary], params)
    : api.get('/attendance/summary', { params }),
  getMy: (params) => isDevMode()
    ? Promise.resolve({
        data: {
          ...fakeAttendanceSummary,
          year: Number(params?.year) || fakeAttendanceSummary.year,
          month: Number(params?.month) || fakeAttendanceSummary.month,
        },
      })
    : api.get('/attendance/summary/my', { params }),
}
