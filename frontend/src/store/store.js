import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import employeeReducer from './employeeSlice';
import departmentReducer from './departmentSlice';
import productReducer from './productSlice';
import userReducer from './userSlice';
import roleReducer from './roleSlice';
import permissionReducer from './permissionSlice';
import salesOrderReducer from './salesOrderSlice';
import supplierReducer from './supplierSlice';
import purchaseOrderReducer from './purchaseOrderSlice';
import categoryReducer from './categorySlice';
import typeReducer from './typeSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        employees: employeeReducer,
        departments: departmentReducer,
        products: productReducer,
        categories: categoryReducer,
        types: typeReducer,
        users: userReducer,
        roles: roleReducer,
        permissions: permissionReducer,
        salesOrders: salesOrderReducer,
        suppliers: supplierReducer,
        purchaseOrders: purchaseOrderReducer,
    },
})
