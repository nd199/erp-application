import { createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'

function parseUserFromToken(accessToken) {
    if (!accessToken) return null
    try {
        const decoded = jwtDecode(accessToken)
        return {
            userId: decoded.userId,
            username: decoded.sub,
            roles: decoded.roles || [],
            permissions: decoded.permissions || [],
        }
    } catch {
        return null
    }
}

const initialState = {
    user: parseUserFromToken(localStorage.getItem('accessToken')),
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isLoggedIn: !!localStorage.getItem('accessToken'),
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            const { accessToken, refreshToken } = action.payload
            state.accessToken = accessToken
            state.refreshToken = refreshToken
            state.user = parseUserFromToken(accessToken)
            state.isLoggedIn = true

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
        },
        logout: (state) => {
            state.user = null
            state.accessToken = null
            state.refreshToken = null
            state.isLoggedIn = false

            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        }
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
