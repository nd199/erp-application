import {createAsyncThunk} from '@reduxjs/toolkit';
import {permissionsAPI} from '../api/permissions';

const fetchPermissions = createAsyncThunk(
    'permissions/fetchAll',
    async (params) => {
        const {data} = await permissionsAPI.getAll(params)
        return data;
    }
)

const fetchPermissionById = createAsyncThunk(
    'permissions/fetchById',
    async (id) => {
        const {data} = await permissionsAPI.getById(id)
        return data
    }
)

const createPermission = createAsyncThunk(
    'permissions/create',
    async (payload) => {
        const {data} = await permissionsAPI.create(payload)
        return data
    }
)

const updatePermission = createAsyncThunk(
    'permissions/update',
    async ({id, ...payload}) => {
        const {data} = await permissionsAPI.update(id, payload)
        return data
    }
)

const deletePermission = createAsyncThunk(
    'permissions/delete',
    async (id) => {
        await permissionsAPI.delete(id)
        return id
    }
)

const searchPermission = createAsyncThunk(
    'permissions/search',
    async ({keyword, params}) => {
        const {data} = await permissionsAPI.search(keyword, params)
        return data
    }
)

export {
    fetchPermissions,
    fetchPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
    searchPermission
}
