import {createSlice} from '@reduxjs/toolkit';
import {
    fetchDepartments,
    fetchDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    searchDepartment
} from './departmentThunks.js'

const pending = (state) => {
    state.loading = true
    state.error = null
}
const rejected = (state, action) => {
    state.loading = false
    state.error = action.error.message
}

const departmentSlice = createSlice({
    name: 'departments',
    initialState: {
        departments: [],
        currDepartment: null,
        loading: false,
        error: null
    },
    reducers: {
        clearCurrDepartment: (state) => {
            state.currDepartment = null;
        },
        clearDeptErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepartments.pending, (state) => {
                pending(state)
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false
                state.departments = action.payload
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(fetchDepartmentById.pending, (state) => {
                pending(state)
            })
            .addCase(fetchDepartmentById.fulfilled, (state, action) => {
                state.loading = false
                state.currDepartment = action.payload
            })
            .addCase(fetchDepartmentById.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(createDepartment.pending, (state) => {
                pending(state)
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.loading = false
                state.departments.push(action.payload)
            })
            .addCase(createDepartment.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(updateDepartment.pending, (state) => {
                pending(state)
            })
            .addCase(updateDepartment.fulfilled, (state, action) => {
                state.loading = false
                state.departments = state.departments
                    .map(d => d.id === action.payload.id ? action.payload : d)
            })
            .addCase(updateDepartment.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(deleteDepartment.pending, (state) => {
                pending(state)
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.loading = false
                state.departments = state.departments
                    .filter(d => d.id !== action.payload)
            })
            .addCase(deleteDepartment.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(searchDepartment.pending, (state) => {
                pending(state)
            })
            .addCase(searchDepartment.fulfilled, (state, action) => {
                state.loading = false
                state.departments = action.payload
            })
            .addCase(searchDepartment.rejected, (state, action) => {
                rejected(state, action)
            })
    }
})

export const {clearCurrDepartment, clearDeptErrors} = departmentSlice.actions
export default departmentSlice.reducer;
