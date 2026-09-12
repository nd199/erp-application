import {createAsyncThunk} from '@reduxjs/toolkit';
import {departmentsAPI} from '../api/departments';

const fetchDepartments = createAsyncThunk(
    'departments/fetchAll',
    async (params) => {
        const {data} = await departmentsAPI.getAll(params)
        return data.content || data;
    }
)

const fetchDepartmentById = createAsyncThunk(
    'departments/fetchById',
    async (id) => {
        const {data} = await departmentsAPI.getById(id)
        return data
    }
)

const createDepartment = createAsyncThunk(
    'departments/create',
    async (payload) => {
        const {data} = await departmentsAPI.create(payload)
        return data
    }
)

const updateDepartment = createAsyncThunk(
    'departments/update',
    async ({id, ...payload}) => {
        const {data} = await departmentsAPI.update(id, payload)
        return data
    }
)

const deleteDepartment = createAsyncThunk(
    'departments/delete',
    async (id) => {
        await departmentsAPI.delete(id)
        return id
    }
)

const searchDepartment = createAsyncThunk(
    'departments/search',
    async ({keyword, params}) => {
        const {data} = await departmentsAPI.search(keyword, params)
        return data.content || data
    }
)

export {
    fetchDepartments,
    fetchDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    searchDepartment
}
