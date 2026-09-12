import {createSlice} from '@reduxjs/toolkit';
import {
    fetchRoles,
    fetchRoleById,
    createRole,
    searchRole,
    getRolePermissions,
    assignPermission,
    removePermission,
    getRoleUsers
} from './roleThunks.js'

const pending = (state) => {
    state.loading = true
    state.error = null
}
const rejected = (state, action) => {
    state.loading = false
    state.error = action.error.message
}

const roleSlice = createSlice({
    name: 'roles',
    initialState: {
        roles: [],
        currRole: null,
        currRolePermissions: [],
        currRoleUsers: [],
        loading: false,
        error: null
    },
    reducers: {
        clearCurrRole: (state) => {
            state.currRole = null;
        },
        clearCurrRolePermissions: (state) => {
            state.currRolePermissions = [];
        },
        clearCurrRoleUsers: (state) => {
            state.currRoleUsers = [];
        },
        clearRoleErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                pending(state)
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false
                state.roles = action.payload
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(fetchRoleById.pending, (state) => {
                pending(state)
            })
            .addCase(fetchRoleById.fulfilled, (state, action) => {
                state.loading = false
                state.currRole = action.payload
            })
            .addCase(fetchRoleById.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(createRole.pending, (state) => {
                pending(state)
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.loading = false
                state.roles.push(action.payload)
            })
            .addCase(createRole.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(searchRole.pending, (state) => {
                pending(state)
            })
            .addCase(searchRole.fulfilled, (state, action) => {
                state.loading = false
                state.roles = action.payload
            })
            .addCase(searchRole.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(getRolePermissions.fulfilled, (state, action) => {
                state.currRolePermissions = action.payload
            })
            .addCase(getRoleUsers.fulfilled, (state, action) => {
                state.currRoleUsers = action.payload
            })
    }
})

export const {
    clearCurrRole,
    clearCurrRolePermissions,
    clearCurrRoleUsers,
    clearRoleErrors
} = roleSlice.actions
export default roleSlice.reducer;
