import api from './axios.js';

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    refresh: (refreshToken) => api.post("/auth/refresh", {refreshToken})
}