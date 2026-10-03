import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    theme: (() => { try { return localStorage.getItem('theme') || 'dark' } catch { return 'dark' } })(),
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark'
            try { localStorage.setItem('theme', state.theme) } catch {}
        },
        setTheme: (state, action) => {
            state.theme = action.payload
            try { localStorage.setItem('theme', state.theme) } catch {}
        },
    },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
