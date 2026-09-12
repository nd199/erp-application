import {createSlice} from '@reduxjs/toolkit';
import {createEmployee, deleteEmployee, fetchById, fetchEmployees, updateEmployee,
searchEmployee} from './employeeThunks.js'

const pending = (state) => {
    state.loading = true
    state.error = null
}
const rejected = (state, action) => {
    state.loading = false
    state.error = action.error.message
}

const employeeSlice = createSlice({
    name: 'employees',
    initialState: {
        employees: [],
        currEmployee: null,
        loading: false,
        error: null
    },
    reducers: {
        clearCurrEmployee: (state) => {
            state.currEmployee = null;
        },
        clearCurrErrors: (state) => {
            state.error = null;
        }
    }, extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                    pending(state)
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                    state.loading = false
                    state.employees = action.payload
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(fetchById.pending, (state) => {
                pending(state)
            })
            .addCase(fetchById.fulfilled, (state, action) => {
                state.loading = false
                state.currEmployee = action.payload
            })
            .addCase(fetchById.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(createEmployee.pending, (state) => {
                pending(state)
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employees.push(action.payload)
            })
            .addCase(createEmployee.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(updateEmployee.pending, (state) => {
                pending(state)
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading = false
                state.employees = state.employees
                    .map(e => e.id === action.payload.id ?
                        action.payload : e)
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(deleteEmployee.pending, (state) => {
                pending(state)
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.loading = false
                state.employees = state.employees
                    .filter(e => e.id !== action.payload)
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(searchEmployee.pending, (state) => {
                pending(state)
            })
            .addCase(searchEmployee.fulfilled, (state, action) => {
                state.loading = false
                state.employees = action.payload
            })
            .addCase(searchEmployee.rejected, (state, action) => {
                rejected(state, action)
            })
    }
})

export const {clearCurrEmployee, clearCurrErrors} = employeeSlice.actions
export default employeeSlice.reducer;
