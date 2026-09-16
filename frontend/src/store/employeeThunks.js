import {createAsyncThunk} from '@reduxjs/toolkit';
import {employeesAPI} from '../api/employees';


const fetchEmployees = createAsyncThunk(
    'employees/fetchAll',
    async (params) => {
        const {data} = await employeesAPI.getAll(params)
        if (Array.isArray(data)) {
            const {
                page = 0,
                size = data.length,
                search = '',
                status = '',
                departmentId = '',
                sort
            } = params || {}
            let rows = [...data]
            if (search) {
                const q = search.toLowerCase()
                rows = rows.filter((e) =>
                    `${e.firstName} ${e.lastName} ${e.email} ${e.jobTitle} ${e.departmentName ?? ''}`.toLowerCase().includes(q)
                )
            }
            if (status) rows = rows.filter((e) => e.status === status)
            if (departmentId) rows = rows.filter((e) =>
                e.departmentId === Number(departmentId) || e.department?.id === Number(departmentId)
            )
            if (sort) {
                const [field, dir] = sort.split(',')
                const get = field === 'department.name'
                    ? (r) => r.departmentName || r.department?.name || ''
                    : (r) => r[field]
                rows.sort((a, b) => {
                    const va = String(get(a) ?? '').toLowerCase()
                    const vb = String(get(b) ?? '').toLowerCase()
                    return dir === 'desc' ? vb.localeCompare(va) : va.localeCompare(vb)
                })
            }
            return {rows: rows.slice(page * size, page * size + size), total: rows.length}
        }
        return {rows: data.content, total: data.totalElements}
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
        return data.content || data
    }
)

const fetchByDepartment = createAsyncThunk(
    'employees/department',
    async ({deptId, params}) => {
        const {data} = await employeesAPI.getByDepartment(
            deptId, params
        )
        return data.content || data
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