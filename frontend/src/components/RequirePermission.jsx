import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { isDevMode } from '../lib/devMode'

function RequirePermission({ permission, children }) {
  if (isDevMode()) return children

  const user = useSelector((state) => state.auth.user)
  const permissions = user?.permissions || []

  if (permissions.includes(permission)) return children

  return <Navigate to="/" replace />
}

export default RequirePermission
