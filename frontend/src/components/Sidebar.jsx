import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiGrid, FiUsers, FiHome, FiBox, FiUser, FiKey, FiShield, FiChevronRight, FiZap, FiBarChart2, FiShoppingCart, FiTruck, FiPackage, FiTag, FiSun, FiMoon } from 'react-icons/fi'
import { isDevMode } from '../lib/devMode'
import { useTheme } from '../lib/ThemeContext'

const allNavItems = [
    { to: '/', label: 'Dashboard', icon: FiGrid, permission: null },
    { to: '/analytics', label: 'Analytics', icon: FiBarChart2, permission: 'REPORT_VIEW' },
    { to: '/employees', label: 'Employees', icon: FiUsers, permission: 'EMPLOYEE_READ' },
    { to: '/departments', label: 'Departments', icon: FiHome, permission: 'EMPLOYEE_READ' },
    { to: '/products', label: 'Products', icon: FiBox, permission: 'PRODUCT_READ' },
    { to: '/categories', label: 'Categories', icon: FiGrid, permission: 'PRODUCT_READ' },
    { to: '/product-types', label: 'Product Types', icon: FiTag, permission: 'PRODUCT_READ' },
    { to: '/orders', label: 'Sales Orders', icon: FiShoppingCart, permission: 'SALES_ORDER_READ' },
    { to: '/suppliers', label: 'Suppliers', icon: FiTruck, permission: 'PURCHASE_READ' },
    { to: '/purchase-orders', label: 'Purchase Orders', icon: FiPackage, permission: 'PURCHASE_READ' },
    { to: '/users', label: 'Users', icon: FiUser, permission: 'USER_READ' },
    { to: '/roles', label: 'Roles', icon: FiKey, permission: 'ROLE_READ' },
    { to: '/permissions', label: 'Permissions', icon: FiShield, permission: 'PERMISSION_READ' },
]

function Sidebar() {
    const userPermissions = useSelector((state) => state.auth.user?.permissions || [])
    const navItems = allNavItems.filter((item) => isDevMode() || !item.permission || userPermissions.includes(item.permission))
    const { theme, toggleTheme } = useTheme()

    return (
        <aside className={`w-[220px] flex flex-col relative shrink-0 ${theme === 'light' ? 'bg-white border-r border-gray-200' : ''}`}>
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/20 via-white/[0.06] to-violet-500/20" />

            {/* Logo */}
            <div className="p-5 relative">
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/10 border border-white/[0.08] flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-violet-500/20 transition-all duration-500">
                            <FiZap className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-gradient tracking-tight leading-none">DevNext</h1>
                        <p className={`text-[10px] uppercase tracking-[0.2em] font-medium mt-0.5 ${theme === 'light' ? 'text-gray-500' : 'text-gray-600'}`}>Enterprise</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-0.5">
                {navItems.map((item, i) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 animate-slide-in-right ${
                                isActive
                                    ? 'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-400 border border-blue-500/20'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/[0.03] border border-transparent'
                            }`
                        }
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r-full" />
                                )}
                                <item.icon className="w-[18px] h-[18px] shrink-0" />
                                <span className="flex-1">{item.label}</span>
                                <FiChevronRight className={`w-3.5 h-3.5 transition-all duration-300 ${isActive ? 'text-blue-400/50' : 'text-gray-700 group-hover:text-gray-500 group-hover:translate-x-0.5'}`} />
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Dev Mode Badge */}
            {isDevMode() && (
                <div className="mx-3 mb-3 px-3 py-2.5 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/10 rounded-xl animate-fade-in">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-glow-pulse" />
                        <p className="text-[10px] text-amber-400/80 font-semibold uppercase tracking-wider">Dev Mode</p>
                    </div>
                </div>
            )}

            <button
                onClick={toggleTheme}
                className="mx-3 mb-3 px-3 py-2.5 w-full flex items-center gap-3 rounded-xl border border-white/[0.06] hover:bg-white/[0.03] transition-all cursor-pointer text-sm text-gray-500 hover:text-white"
            >
                {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                <span className="flex-1">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                <span className="text-[10px] text-gray-700 bg-white/[0.06] px-1.5 py-0.5 rounded-md font-mono">
                    {theme === 'dark' ? 'D' : 'L'}
                </span>
            </button>

            <div className="h-4" />
        </aside>
    )
}

export default Sidebar
export { allNavItems as navItems }
