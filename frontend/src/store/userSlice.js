import {createSlice} from '@reduxjs/toolkit';
import {
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    searchUser,
    activateUser,
    deactivateUser,
    lockUser,
    unlockUser,
    assignRole,
    removeRole,
    getUserRoles
} from './userThunks.js'

const pending = (state) => {
    state.loading = true
    state.error = null
}
const rejected = (state, action) => {
    state.loading = false
    state.error = action.error.message
}

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        currUser: null,
        currUserRoles: [],
        loading: false,
        error: null
    },
    reducers: {
        clearCurrUser: (state) => {
            state.currUser = null;
        },
        clearCurrUserRoles: (state) => {
            state.currUserRoles = [];
        },
        clearUserErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                pending(state)
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(fetchUserById.pending, (state) => {
                pending(state)
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false
                state.currUser = action.payload
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(createUser.pending, (state) => {
                pending(state)
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false
                state.users.push(action.payload)
            })
            .addCase(createUser.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(updateUser.pending, (state) => {
                pending(state)
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false
                state.users = state.users
                    .map(u => u.id === action.payload.id ? action.payload : u)
            })
            .addCase(updateUser.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(deleteUser.pending, (state) => {
                pending(state)
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false
                state.users = state.users
                    .filter(u => u.id !== action.payload)
            })
            .addCase(deleteUser.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(searchUser.pending, (state) => {
                pending(state)
            })
            .addCase(searchUser.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload
            })
            .addCase(searchUser.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(activateUser.fulfilled, (state, action) => {
                state.users = state.users
                    .map(u => u.id === action.payload.id ? action.payload : u)
            })
            .addCase(deactivateUser.fulfilled, (state, action) => {
                state.users = state.users
                    .map(u => u.id === action.payload.id ? action.payload : u)
            })
            .addCase(lockUser.fulfilled, (state, action) => {
                state.users = state.users
                    .map(u => u.id === action.payload.id ? action.payload : u)
            })
            .addCase(unlockUser.fulfilled, (state, action) => {
                state.users = state.users
                    .map(u => u.id === action.payload.id ? action.payload : u)
            })
            .addCase(getUserRoles.fulfilled, (state, action) => {
                state.currUserRoles = action.payload
            })
    }
})

export const {clearCurrUser, clearCurrUserRoles, clearUserErrors} = userSlice.actions
export default userSlice.reducer;
