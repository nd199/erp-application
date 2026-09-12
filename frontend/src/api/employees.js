import api from './axios'

export const employeesAPI = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.patch(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  search: (keyword, params) => api.get('/employees/search', { params: { keyword, ...params } }),
  getByDepartment: (deptId, params) => api.get(`/employees/department/${deptId}`, { params }),
}
