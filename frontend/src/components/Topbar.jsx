import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { FiSearch, FiBell, FiChevronDown, FiLogOut, FiUser, FiSettings, FiHelpCircle, FiArrowRight } from 'react-icons/fi'
import { FiSun, FiMoon } from 'react-icons/fi'
import { navItems } from './Sidebar'
import { fakeEmployees, fakeDepartments, fakeUsers } from '../lib/fakeData'
import { useTheme } from '../lib/ThemeContext'

function ProfileDropdown({ user, onLogout }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const menuItems = [
        { label: 'My Profile', icon: FiUser, action: () => {} },
        { label: 'Settings', icon: FiSettings, action: () => {} },
        { label: 'Help & Support', icon: FiHelpCircle, action: () => {} },
    ]

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all duration-200 cursor-pointer group"
            >
                <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/10 border border-white/[0.08] flex items-center justify-center">
                        <span className="text-[10px] font-bold text-blue-400">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-[1.5px] border-[#06060b]" />
                </div>
                <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium text-white leading-none">{user?.username || 'User'}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">{user?.roles?.[0] || 'Member'}</p>
                </div>
                <FiChevronDown className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-2xl shadow-2xl shadow-black/60 border border-white/[0.08] py-2 animate-scale-in z-50">
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                        <p className="text-sm font-semibold text-white">{user?.username || 'User'}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{user?.roles?.join(', ') || 'No roles'}</p>
                    </div>
                    <div className="py-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => { item.action(); setOpen(false) }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <div className="border-t border-white/[0.06] pt-1 mt-1">
                        <button
                            onClick={() => { onLogout(); setOpen(false) }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
                        >
                            <FiLogOut className="w-4 h-4" />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function Topbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchFocused, setSearchFocused] = useState(false)
    const searchRef = useRef(null)
    const [now, setNow] = useState(new Date())
    const [sessionStart] = useState(() => Date.now())

    useEffect(() => {
        const handleClick = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false) }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    useEffect(() => {
        const handleKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                document.querySelector('input[placeholder="Search anything..."]')?.focus()
            }
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    const formatTime = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
    const formatDate = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

    const sessionSeconds = Math.floor((Date.now() - sessionStart) / 1000)
    const sessionH = Math.floor(sessionSeconds / 3600)
    const sessionM = Math.floor((sessionSeconds % 3600) / 60)
    const sessionS = sessionSeconds % 60
    const sessionTime = `${sessionH > 0 ? sessionH + ':' : ''}${sessionM.toString().padStart(2, '0')}:${sessionS.toString().padStart(2, '0')}`

    const kw = searchQuery.toLowerCase().trim()
    const searchResults = kw ? [
        ...navItems.filter((n) => n.label.toLowerCase().includes(kw)).map((n) => ({ type: 'page', title: n.label, subtitle: 'Navigate to page', to: n.to, icon: n.label[0] })),
        ...fakeEmployees.filter((e) => `${e.firstName} ${e.lastName} ${e.email}`.toLowerCase().includes(kw)).slice(0, 3).map((e) => ({ type: 'employee', title: `${e.firstName} ${e.lastName}`, subtitle: e.email, to: '/employees', icon: `${e.firstName[0]}${e.lastName[0]}` })),
        ...fakeDepartments.filter((d) => d.name.toLowerCase().includes(kw)).slice(0, 2).map((d) => ({ type: 'department', title: d.name, subtitle: d.description, to: '/departments', icon: d.name[0] })),
        ...fakeUsers.filter((u) => `${u.username} ${u.email}`.toLowerCase().includes(kw)).slice(0, 2).map((u) => ({ type: 'user', title: u.username, subtitle: u.email, to: '/users', icon: u.username[0].toUpperCase() })),
    ] : []

    const handleLogout = () => { dispatch(logout()); navigate('/login') }
    const { theme, toggleTheme } = useTheme()

    return (
        <header className={`h-20 px-6 flex items-center justify-between relative shrink-0 ${theme === 'light' ? 'bg-white border-b border-gray-200' : 'bg-white/[0.01]'}`}>
            <div className={`absolute bottom-0 left-0 right-0 h-px ${theme === 'light' ? 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200' : 'bg-gradient-to-r from-white/[0.06] via-white/[0.08] to-white/[0.06]'}`} />

            {/* Left: Inline Search */}
            <div className="relative flex-1 max-w-md" ref={searchRef}>
                <FiSearch className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-600'}`} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setSearchFocused(true) }}
                    onFocus={() => setSearchFocused(true)}
                    placeholder="Search anything..."
                    className={`w-full pl-10 pr-20 py-2.5 rounded-xl text-sm outline-none focus:border-blue-500/40 focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)] transition-all duration-300 ${
                        theme === 'light'
                            ? 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500/40'
                            : 'bg-white/[0.03] border border-white/[0.06] text-white placeholder-gray-600 focus:bg-white/[0.05]'
                    }`}
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-[9px] text-gray-700 bg-white/[0.04] border border-white/[0.06] rounded font-mono">⌘K</kbd>

                {searchFocused && searchQuery.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-2xl shadow-2xl shadow-black/60 border border-white/[0.08] py-2 animate-scale-in z-50 max-h-[360px] overflow-y-auto">
                        {searchResults.length === 0 ? (
                            <div className="px-5 py-8 text-center">
                                <p className="text-sm text-gray-500">No results found</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {searchResults.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { navigate(item.to); setSearchQuery(''); setSearchFocused(false) }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.04] hover:text-white transition-all duration-200 cursor-pointer group"
                                    >
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'page' ? 'bg-blue-500/10 border border-blue-500/20' : item.type === 'employee' ? 'bg-violet-500/10 border border-violet-500/20' : item.type === 'department' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                                            <span className={`text-[9px] font-bold ${item.type === 'page' ? 'text-blue-400' : item.type === 'employee' ? 'text-violet-400' : item.type === 'department' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                {item.icon}
                                            </span>
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <p className="truncate font-medium">{item.title}</p>
                                            <p className="text-[10px] text-gray-600 truncate">{item.subtitle}</p>
                                        </div>
                                        <FiArrowRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-500 shrink-0" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right: Clock, Notifications, Profile */}
            <div className="flex items-center gap-2 ml-4">
                <div className="flex items-center gap-3 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                    <div className="text-right">
                        <p className="text-xs font-mono font-semibold text-white leading-none">{formatTime(now)}</p>
                        <p className="text-[9px] text-gray-600 mt-0.5">{formatDate(now)}</p>
                    </div>
                    <div className="w-px h-6 bg-white/[0.06]" />
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 leading-none">Online</p>
                        <p className="text-[10px] font-mono font-semibold text-emerald-400 mt-0.5">{sessionTime}</p>
                    </div>
                </div>

                <button className="relative p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.04] transition-all duration-200 cursor-pointer">
                    <FiBell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-[#06060b]" />
                </button>

                <div className="w-px h-6 bg-white/[0.06] mx-1" />

                <button
                    onClick={toggleTheme}
                    className="relative p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                </button>

                <ProfileDropdown user={user} onLogout={handleLogout} />
            </div>
        </header>
    )
}

export default Topbar
