import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiUsers, FiHome, FiUser, FiKey, FiShield, FiTrendingUp, FiArrowUpRight, FiActivity, FiBarChart2, FiShoppingCart } from 'react-icons/fi'
import LineChart from '../components/charts/LineChart'
import BarChart from '../components/charts/BarChart'
import Legend from '../components/charts/Legend'
import { employeeGrowth, monthlyHiring } from '../lib/chartData'
import { fetchEmployees } from '../store/employeeThunks'
import { fetchDepartments } from '../store/departmentThunks'
import { fetchProducts } from '../store/productThunks'
import { fetchUsers } from '../store/userThunks'
import { fetchRoles } from '../store/roleThunks'
import { fetchSalesOrders } from '../store/salesOrderThunks'
import { isDevMode } from '../lib/devMode'
import { fakeEmployees, fakeDepartments, fakeUsers, fakeRoles, fakePermissions } from '../lib/fakeData'

function AnimatedCounter({ end, duration = 1200 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * end))
      if (progress < 1) ref.current = requestAnimationFrame(step)
    }
    ref.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(ref.current)
  }, [end, duration])
  return <span>{count}</span>
}

function MiniSparkline({ data, color = '#3b82f6', width = 80, height = 28 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const padding = 2

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = padding + (1 - (v - min) / range) * (height - padding * 2)
    return `${x},${y}`
  }).join(' ')

  const areaPoints = `${points} ${width - padding},${height} ${padding},${height}`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#spark-${color})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const stats = [
  { label: 'Total Employees', value: fakeEmployees.length, icon: FiUsers, gradient: 'from-blue-600/20 to-blue-400/5', border: 'border-blue-500/20', text: 'text-blue-400', sparkData: [42, 49, 54, 66, 75, 90, 101, 109, 123, 129, 139, 152], sparkColor: '#3b82f6', change: '+12%' },
  { label: 'Departments', value: fakeDepartments.length, icon: FiHome, gradient: 'from-violet-600/20 to-violet-400/5', border: 'border-violet-500/20', text: 'text-violet-400', sparkData: [3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 8], sparkColor: '#8b5cf6', change: '+2' },
  { label: 'Active Users', value: fakeUsers.filter((u) => u.status === 'ACTIVE').length, icon: FiUser, gradient: 'from-emerald-600/20 to-emerald-400/5', border: 'border-emerald-500/20', text: 'text-emerald-400', sparkData: [2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4], sparkColor: '#10b981', change: '+5' },
  { label: 'Access Control', value: fakeRoles.length + fakePermissions.length, icon: FiShield, gradient: 'from-amber-600/20 to-amber-400/5', border: 'border-amber-500/20', text: 'text-amber-400', sparkData: [15, 17, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19], sparkColor: '#f59e0b', change: '3 new' },
]

const recentActivity = [
  { action: 'New employee added', name: 'Raj Kumar', time: '2 min ago', type: 'create' },
  { action: 'Department updated', name: 'Engineering', time: '15 min ago', type: 'update' },
  { action: 'User activated', name: 'priya.hr', time: '1 hour ago', type: 'activate' },
  { action: 'Role created', name: 'SUPER_ADMIN', time: '3 hours ago', type: 'create' },
  { action: 'Permission modified', name: 'EMPLOYEE_VIEW', time: '5 hours ago', type: 'update' },
]

const typeColors = {
  create: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  update: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  activate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

function Dashboard() {
  const dispatch = useDispatch()
  const employees = useSelector((s) => s.employees.employees)
  const departments = useSelector((s) => s.departments.departments)
  const products = useSelector((s) => s.products.products)
  const users = useSelector((s) => s.users?.users || [])
  const roles = useSelector((s) => s.roles?.roles || [])
  const orders = useSelector((s) => s.salesOrders?.orders || [])

  useEffect(() => {
    dispatch(fetchEmployees({ page: 0, size: 100 }))
    dispatch(fetchDepartments())
    dispatch(fetchProducts())
    dispatch(fetchUsers())
    dispatch(fetchRoles())
    dispatch(fetchSalesOrders({ page: 0, size: 100 }))
  }, [dispatch])

  const empList = isDevMode() ? fakeEmployees : employees
  const deptList = isDevMode() ? fakeDepartments : departments
  const userList = isDevMode() ? fakeUsers : users
  const roleList = isDevMode() ? fakeRoles : roles
  const activeUsers = userList.filter((u) => u.status === 'ACTIVE').length
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)

  const stats = [
    { label: 'Total Employees', value: empList.length, icon: FiUsers, gradient: 'from-blue-600/20 to-blue-400/5', border: 'border-blue-500/20', text: 'text-blue-400', sparkData: [42, 49, 54, 66, 75, 90, 101, 109, 123, 129, 139, 152], sparkColor: '#3b82f6', change: '+12%' },
    { label: 'Departments', value: deptList.length, icon: FiHome, gradient: 'from-violet-600/20 to-violet-400/5', border: 'border-violet-500/20', text: 'text-violet-400', sparkData: [3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 8], sparkColor: '#8b5cf6', change: '+2' },
    { label: 'Active Users', value: activeUsers, icon: FiUser, gradient: 'from-emerald-600/20 to-emerald-400/5', border: 'border-emerald-500/20', text: 'text-emerald-400', sparkData: [2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4], sparkColor: '#10b981', change: '+5' },
    { label: 'Total Orders', value: orders.length, icon: FiShoppingCart, gradient: 'from-amber-600/20 to-amber-400/5', border: 'border-amber-500/20', text: 'text-amber-400', sparkData: [1, 2, 3, 3, 4, 5, 5, 5, 5, 5, 5, 5], sparkColor: '#f59e0b', change: `${orders.length} total` },
  ]
  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gradient mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">Here&apos;s what&apos;s happening across your organization.</p>
      </div>

      {/* Stats with sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="group relative p-5 glass rounded-2xl hover-lift overflow-hidden animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} border ${stat.border} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <stat.icon className={`w-5 h-5 ${stat.text}`} />
                </div>
                <div className="w-20 h-7 opacity-60 group-hover:opacity-100 transition-opacity">
                  <MiniSparkline data={stat.sparkData} color={stat.sparkColor} />
                </div>
              </div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter end={stat.value} />
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">
                  <FiTrendingUp className="w-3 h-3" />{stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Employee Growth Line Chart */}
        <div className="glass rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-white">Employee Growth</h2>
            </div>
            <span className="text-[10px] text-gray-600 font-medium">12 months</span>
          </div>
          <div className="p-6">
            <div className="h-[200px]">
              <LineChart data={employeeGrowth} label="value" color="#3b82f6" />
            </div>
          </div>
        </div>

        {/* Monthly Hiring Bar Chart */}
        <div className="glass rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '380ms' }}>
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiBarChart2 className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-white">Monthly Hiring</h2>
            </div>
            <span className="text-[10px] text-gray-600 font-medium">This year</span>
          </div>
          <div className="p-6">
            <div className="h-[200px]">
              <BarChart data={monthlyHiring} color="#8b5cf6" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Employees - compact */}
        <div className="glass rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '350ms' }}>
          <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiActivity className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-white">Recent</h2>
            </div>
            <button className="text-[10px] text-gray-600 hover:text-blue-400 transition-colors cursor-pointer">View all</button>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {empList.slice(0, 3).map((emp, i) => (
              <div key={emp.id} className="group flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-all duration-200 animate-slide-in-right" style={{ animationDelay: `${400 + i * 50}ms` }}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/15 to-violet-500/10 border border-white/[0.06] flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-blue-400">{emp.firstName[0]}{emp.lastName[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{emp.firstName} {emp.lastName}</p>
                  <p className="text-[10px] text-gray-600 truncate">{emp.jobTitle}</p>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium border shrink-0 ${emp.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>{emp.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Directory Grid - 10 cards */}
        <div className="lg:col-span-2 glass rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiUsers className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-white">Team Directory</h2>
            </div>
            <span className="text-[10px] text-gray-600">{empList.length} members</span>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {empList.slice(0, 10).map((emp, i) => (
              <div key={emp.id} className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/[0.03] transition-all duration-200 cursor-default animate-scale-in" style={{ animationDelay: `${450 + i * 40}ms` }}>
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/15 to-violet-500/10 border border-white/[0.06] flex items-center justify-center group-hover:scale-110 group-hover:border-blue-500/20 transition-all duration-300">
                    <span className="text-xs font-bold text-blue-400">{emp.firstName[0]}{emp.lastName[0]}</span>
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-gray-900 ${emp.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-medium text-white truncate w-full">{emp.firstName}</p>
                  <p className="text-[9px] text-gray-600 truncate w-full">{emp.department?.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Right Column - Departments */}
        <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-white">Departments</h2>
          </div>
          <div className="space-y-3">
            {deptList.slice(0, 5).map((dept, i) => {
              const count = empList.filter((e) => e.department?.id === dept.id).length
              const maxCount = Math.max(...deptList.map((d) => empList.filter((e) => e.department?.id === d.id).length))
              const pct = maxCount > 0 ? (count / maxCount) * 100 : 0
              return (
                <div key={dept.id} className="animate-slide-in-right" style={{ animationDelay: `${550 + i * 40}ms` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400 font-medium">{dept.name}</span>
                    <span className="text-[10px] text-gray-600 font-mono">{count}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500/60 to-violet-500/40 rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, transitionDelay: `${600 + i * 80}ms` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Activity */}
        <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '550ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <FiActivity className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-white">Activity</h2>
          </div>
          <div className="space-y-2.5">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 animate-slide-in-right" style={{ animationDelay: `${600 + i * 40}ms` }}>
                <div className={`mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border shrink-0 ${typeColors[item.type]}`}>{item.type[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300">{item.action}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{item.name} · {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-white">Quick Stats</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Avg. tenure', value: '2.4 yrs', color: 'text-blue-400' },
              { label: 'This month hires', value: '13', color: 'text-emerald-400' },
              { label: 'Open positions', value: '7', color: 'text-amber-400' },
              { label: 'Retention rate', value: '94%', color: 'text-violet-400' },
              { label: 'Avg. performance', value: '87/100', color: 'text-cyan-400' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between animate-slide-in-right" style={{ animationDelay: `${650 + i * 40}ms` }}>
                <span className="text-xs text-gray-500">{stat.label}</span>
                <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
