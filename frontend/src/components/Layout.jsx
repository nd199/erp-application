import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { FiGrid, FiUsers, FiHome, FiUser, FiKey, FiShield, FiLogOut } from 'react-icons/fi'

const navItems = [
    { to: '/', label: 'Dashboard', icon: FiGrid },
    { to: '/employees', label: 'Employees', icon: FiUsers },
    { to: '/departments', label: 'Departments', icon: FiHome },
    { to: '/users', label: 'Users', icon: FiUser },
    { to: '/roles', label: 'Roles', icon: FiKey },
    { to: '/permissions', label: 'Permissions', icon: FiShield },
]

function Layout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user)

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    return (
        <div className="flex h-screen bg-gray-950">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900/80 border-r border-white/10 flex flex-col">
                <div className="p-5 border-b border-white/10">
                    <h1 className="text-xl font-bold text-white">ERP System</h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                                        : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'
                                }`
                            }
                        >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="text-sm text-white/40 mb-2 px-3">
                        {user?.username}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400/70 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all cursor-pointer"
                    >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-gray-900/50 border-b border-white/10 px-6 py-4 flex items-center justify-between">
                    <div className="text-white/40 text-sm">
                        {user?.roles?.join(', ')}
                    </div>
                    <div className="text-sm text-white/40">
                        {user?.username}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-gray-950">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Layout
