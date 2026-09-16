import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import employeeReducer from './employeeSlice';
import departmentReducer from './departmentSlice';
import productReducer from './productSlice';
import userReducer from './userSlice';
import roleReducer from './roleSlice';
import permissionReducer from './permissionSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        employees: employeeReducer,
        departments: departmentReducer,
        products: productReducer,
        users: userReducer,
        roles: roleReducer,
        permissions: permissionReducer,
    },
})
