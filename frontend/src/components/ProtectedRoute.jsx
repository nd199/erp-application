import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { isDevMode } from '../lib/devMode'

function ProtectedRoute() {
    if (isDevMode()) return <Outlet />
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
    if (!isLoggedIn) return <Navigate to="/login" replace />
    return <Outlet />
}

export default ProtectedRoute
