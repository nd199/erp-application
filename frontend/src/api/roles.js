import api from './axios'

export const rolesAPI = {
  getAll: (params) => api.get('/roles', { params }),
  getById: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', data),
  search: (keyword, params) => api.get('/roles/search', { params: { keyword, ...params } }),
  getPermissions: (roleId) => api.get(`/roles/${roleId}/permissions`),
  assignPermission: (roleId, permissionId) => api.post(`/roles/${roleId}/permissions/${permissionId}`),
  removePermission: (roleId, permissionId) => api.delete(`/roles/${roleId}/permissions/${permissionId}`),
  getUsers: (roleId) => api.get(`/roles/${roleId}/users`),
}
