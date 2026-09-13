import { createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import { isDevMode } from '../lib/devMode'
import { fakeDevUser } from '../lib/fakeData'

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

const devUser = isDevMode() ? fakeDevUser : null

const initialState = {
    user: devUser || parseUserFromToken(localStorage.getItem('accessToken')),
    accessToken: devUser ? 'dev-token' : (localStorage.getItem('accessToken') || null),
    refreshToken: devUser ? 'dev-refresh' : (localStorage.getItem('refreshToken') || null),
    isLoggedIn: devUser ? true : !!localStorage.getItem('accessToken'),
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
