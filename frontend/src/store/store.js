import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
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
import leaveReducer from './leaveSlice';
import attendanceReducer from './attendanceSlice';
import payrollReducer from './payrollSlice';
import leaveBalanceReducer from './leaveBalanceSlice';
import orgChartReducer from './orgChartSlice';
import payslipReducer from './payslipSlice';
import attendanceSummaryReducer from './attendanceSummarySlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
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
        leaves: leaveReducer,
        attendance: attendanceReducer,
        payroll: payrollReducer,
        leaveBalances: leaveBalanceReducer,
        orgChart: orgChartReducer,
        payslips: payslipReducer,
        attendanceSummary: attendanceSummaryReducer,
    },
})
