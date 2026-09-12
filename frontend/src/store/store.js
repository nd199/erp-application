import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import employeeReducer from './employeeSlice';
import departmentReducer from './departmentSlice';
import userReducer from './userSlice';
import roleReducer from './roleSlice';
import permissionReducer from './permissionSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        employees: employeeReducer,
        departments: departmentReducer,
        users: userReducer,
        roles: roleReducer,
        permissions: permissionReducer,
    },
})
