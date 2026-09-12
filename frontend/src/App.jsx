import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<h1 className="text-2xl font-bold">Dashboard</h1>} />
                    <Route path="/employees" element={<h1 className="text-2xl font-bold">Employees</h1>} />
                    <Route path="/departments" element={<h1 className="text-2xl font-bold">Departments</h1>} />
                    <Route path="/users" element={<h1 className="text-2xl font-bold">Users</h1>} />
                    <Route path="/roles" element={<h1 className="text-2xl font-bold">Roles</h1>} />
                    <Route path="/permissions" element={<h1 className="text-2xl font-bold">Permissions</h1>} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
