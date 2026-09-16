import { NavLink } from 'react-router-dom'
import { FiGrid, FiUsers, FiHome, FiBox, FiUser, FiKey, FiShield, FiChevronRight, FiZap, FiBarChart2 } from 'react-icons/fi'
import { isDevMode } from '../lib/devMode'

const navItems = [
    { to: '/', label: 'Dashboard', icon: FiGrid },
    { to: '/analytics', label: 'Analytics', icon: FiBarChart2 },
    { to: '/employees', label: 'Employees', icon: FiUsers },
    { to: '/departments', label: 'Departments', icon: FiHome },
    { to: '/products', label: 'Products', icon: FiBox },
    { to: '/users', label: 'Users', icon: FiUser },
    { to: '/roles', label: 'Roles', icon: FiKey },
    { to: '/permissions', label: 'Permissions', icon: FiShield },
]

function Sidebar() {
    return (
        <aside className="w-[220px] flex flex-col relative shrink-0">
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
                        <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-medium mt-0.5">Enterprise</p>
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
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] border border-transparent'
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

            <div className="h-4" />
        </aside>
    )
}

export default Sidebar
export { navItems }
