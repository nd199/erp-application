import {createSlice} from '@reduxjs/toolkit';
import {
    fetchPermissions,
    fetchPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
    searchPermission
} from './permissionThunks.js'

const pending = (state) => {
    state.loading = true
    state.error = null
}
const rejected = (state, action) => {
    state.loading = false
    state.error = action.error.message
}

const permissionSlice = createSlice({
    name: 'permissions',
    initialState: {
        permissions: [],
        currPermission: null,
        loading: false,
        error: null
    },
    reducers: {
        clearCurrPermission: (state) => {
            state.currPermission = null;
        },
        clearPermissionErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPermissions.pending, (state) => {
                pending(state)
            })
            .addCase(fetchPermissions.fulfilled, (state, action) => {
                state.loading = false
                state.permissions = action.payload
            })
            .addCase(fetchPermissions.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(fetchPermissionById.pending, (state) => {
                pending(state)
            })
            .addCase(fetchPermissionById.fulfilled, (state, action) => {
                state.loading = false
                state.currPermission = action.payload
            })
            .addCase(fetchPermissionById.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(createPermission.pending, (state) => {
                pending(state)
            })
            .addCase(createPermission.fulfilled, (state, action) => {
                state.loading = false
                state.permissions.push(action.payload)
            })
            .addCase(createPermission.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(updatePermission.pending, (state) => {
                pending(state)
            })
            .addCase(updatePermission.fulfilled, (state, action) => {
                state.loading = false
                state.permissions = state.permissions
                    .map(p => p.id === action.payload.id ? action.payload : p)
            })
            .addCase(updatePermission.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(deletePermission.pending, (state) => {
                pending(state)
            })
            .addCase(deletePermission.fulfilled, (state, action) => {
                state.loading = false
                state.permissions = state.permissions
                    .filter(p => p.id !== action.payload)
            })
            .addCase(deletePermission.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(searchPermission.pending, (state) => {
                pending(state)
            })
            .addCase(searchPermission.fulfilled, (state, action) => {
                state.loading = false
                state.permissions = action.payload
            })
            .addCase(searchPermission.rejected, (state, action) => {
                rejected(state, action)
            })
    }
})

export const {clearCurrPermission, clearPermissionErrors} = permissionSlice.actions
export default permissionSlice.reducer;
