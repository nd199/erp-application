import {createAsyncThunk} from '@reduxjs/toolkit';
import {usersAPI} from '../api/users';

const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async (params) => {
        const {data} = await usersAPI.getAll(params)
        return data.content || data;
    }
)

const fetchUserById = createAsyncThunk(
    'users/fetchById',
    async (id) => {
        const {data} = await usersAPI.getById(id)
        return data
    }
)

const createUser = createAsyncThunk(
    'users/create',
    async (payload) => {
        const {data} = await usersAPI.create(payload)
        return data
    }
)

const updateUser = createAsyncThunk(
    'users/update',
    async ({id, ...payload}) => {
        const {data} = await usersAPI.update(id, payload)
        return data
    }
)

const deleteUser = createAsyncThunk(
    'users/delete',
    async (id) => {
        await usersAPI.delete(id)
        return id
    }
)

const searchUser = createAsyncThunk(
    'users/search',
    async ({keyword, params}) => {
        const {data} = await usersAPI.search(keyword, params)
        return data.content || data
    }
)

const activateUser = createAsyncThunk(
    'users/activate',
    async (id) => {
        const {data} = await usersAPI.activate(id)
        return data
    }
)

const deactivateUser = createAsyncThunk(
    'users/deactivate',
    async (id) => {
        const {data} = await usersAPI.deactivate(id)
        return data
    }
)

const lockUser = createAsyncThunk(
    'users/lock',
    async (id) => {
        const {data} = await usersAPI.lock(id)
        return data
    }
)

const unlockUser = createAsyncThunk(
    'users/unlock',
    async (id) => {
        const {data} = await usersAPI.unlock(id)
        return data
    }
)

const assignRole = createAsyncThunk(
    'users/assignRole',
    async ({userId, roleId}) => {
        await usersAPI.assignRole(userId, roleId)
        return {userId, roleId}
    }
)

const removeRole = createAsyncThunk(
    'users/removeRole',
    async ({userId, roleId}) => {
        await usersAPI.removeRole(userId, roleId)
        return {userId, roleId}
    }
)

const getUserRoles = createAsyncThunk(
    'users/getRoles',
    async (userId) => {
        const {data} = await usersAPI.getRoles(userId)
        return data
    }
)

export {
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
}
