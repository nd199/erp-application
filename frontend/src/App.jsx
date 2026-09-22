import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Departments from './pages/Departments'
import Products from './pages/Products'
import Categories from './pages/Categories'
import ProductTypes from './pages/ProductTypes'
import SalesOrders from './pages/SalesOrders'
import Suppliers from './pages/Suppliers'
import PurchaseOrders from './pages/PurchaseOrders'
import Users from './pages/Users'
import Roles from './pages/Roles'
import Permissions from './pages/Permissions'
import Analytics from './pages/Analytics'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import RequirePermission from './components/RequirePermission'

function App() {
    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'rgba(17, 24, 39, 0.9)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                    },
                }}
            />
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/employees" element={<RequirePermission permission="EMPLOYEE_READ"><Employees /></RequirePermission>} />
                        <Route path="/departments" element={<RequirePermission permission="EMPLOYEE_READ"><Departments /></RequirePermission>} />
                        <Route path="/products" element={<RequirePermission permission="PRODUCT_READ"><Products /></RequirePermission>} />
                        <Route path="/categories" element={<RequirePermission permission="PRODUCT_READ"><Categories /></RequirePermission>} />
                        <Route path="/product-types" element={<RequirePermission permission="PRODUCT_READ"><ProductTypes /></RequirePermission>} />
                        <Route path="/orders" element={<RequirePermission permission="SALES_ORDER_READ"><SalesOrders /></RequirePermission>} />
                        <Route path="/suppliers" element={<RequirePermission permission="PURCHASE_READ"><Suppliers /></RequirePermission>} />
                        <Route path="/purchase-orders" element={<RequirePermission permission="PURCHASE_READ"><PurchaseOrders /></RequirePermission>} />
                        <Route path="/users" element={<RequirePermission permission="USER_READ"><Users /></RequirePermission>} />
                        <Route path="/roles" element={<RequirePermission permission="ROLE_READ"><Roles /></RequirePermission>} />
                        <Route path="/permissions" element={<RequirePermission permission="PERMISSION_READ"><Permissions /></RequirePermission>} />
                        <Route path="/analytics" element={<RequirePermission permission="REPORT_VIEW"><Analytics /></RequirePermission>} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}

export default App
