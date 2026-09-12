import {createAsyncThunk} from '@reduxjs/toolkit';
import {rolesAPI} from '../api/roles';

const fetchRoles = createAsyncThunk(
    'roles/fetchAll',
    async (params) => {
        const {data} = await rolesAPI.getAll(params)
        return data;
    }
)

const fetchRoleById = createAsyncThunk(
    'roles/fetchById',
    async (id) => {
        const {data} = await rolesAPI.getById(id)
        return data
    }
)

const createRole = createAsyncThunk(
    'roles/create',
    async (payload) => {
        const {data} = await rolesAPI.create(payload)
        return data
    }
)

const searchRole = createAsyncThunk(
    'roles/search',
    async ({keyword, params}) => {
        const {data} = await rolesAPI.search(keyword, params)
        return data
    }
)

const getRolePermissions = createAsyncThunk(
    'roles/getPermissions',
    async (roleId) => {
        const {data} = await rolesAPI.getPermissions(roleId)
        return data
    }
)

const assignPermission = createAsyncThunk(
    'roles/assignPermission',
    async ({roleId, permissionId}) => {
        await rolesAPI.assignPermission(roleId, permissionId)
        return {roleId, permissionId}
    }
)

const removePermission = createAsyncThunk(
    'roles/removePermission',
    async ({roleId, permissionId}) => {
        await rolesAPI.removePermission(roleId, permissionId)
        return {roleId, permissionId}
    }
)

const getRoleUsers = createAsyncThunk(
    'roles/getUsers',
    async (roleId) => {
        const {data} = await rolesAPI.getUsers(roleId)
        return data
    }
)

export {
    fetchRoles,
    fetchRoleById,
    createRole,
    searchRole,
    getRolePermissions,
    assignPermission,
    removePermission,
    getRoleUsers
}
