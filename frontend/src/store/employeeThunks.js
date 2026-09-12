import {createAsyncThunk} from '@reduxjs/toolkit';
import {employeesAPI} from '../api/employees';


const fetchEmployees = createAsyncThunk(
    'employees/fetchAll',
    async (params) => {
        const {data} = await employeesAPI.getAll(params)
        return data;
    }
)

const fetchById = createAsyncThunk(
    'employees/fetchById',
    async (id) => {
        const {data} = await employeesAPI.getById(id)
        return data
    }
)

const createEmployee = createAsyncThunk(
    'employees/create',
    async (payload) => {
        const {data} = await employeesAPI.create(payload)
        return data
    }
)

const updateEmployee = createAsyncThunk(
    'employees/update',
    async ({id, ...payload}) => {
        const {data} = await employeesAPI.update(id, payload)
        return data
    }
)

const deleteEmployee = createAsyncThunk(
    'employees/delete',
    async (id) => {
        await employeesAPI.delete(id)
        return id
    }
)

const searchEmployee = createAsyncThunk(
    'employees/search',
    async ({keyword, params}) => {
        const {data} = await employeesAPI.search(keyword, params)
        return data
    }
)

const fetchByDepartment = createAsyncThunk(
    'employees/department',
    async ({deptId, params}) => {
        const {data} = await employeesAPI.getByDepartment(
            deptId, params
        )
        return data
    }
)

export {
    fetchEmployees,
    fetchById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployee,
    fetchByDepartment
}