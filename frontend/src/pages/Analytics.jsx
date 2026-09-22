import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiBarChart2, FiTrendingUp, FiPieChart, FiActivity } from 'react-icons/fi'
import LineChart from '../components/charts/LineChart'
import DonutChart from '../components/charts/DonutChart'
import BarChart from '../components/charts/BarChart'
import AreaChart from '../components/charts/AreaChart'
import RadialProgress from '../components/charts/RadialProgress'
import Legend from '../components/charts/Legend'
import { employeeGrowth, monthlyHiring, weeklyActivity, performanceMetrics, revenueData, topPerformers } from '../lib/chartData'
import { fetchEmployees } from '../store/employeeThunks'
import { fetchDepartments } from '../store/departmentThunks'
import { fetchUsers } from '../store/userThunks'
import { fetchSalesOrders } from '../store/salesOrderThunks'
import { isDevMode } from '../lib/devMode'
import { fakeEmployees, fakeDepartments, fakeUsers } from '../lib/fakeData'

function ChartCard({ title, subtitle, icon: Icon, children, className = '', delay = 0 }) {
  return (
    <div className={`glass rounded-2xl overflow-hidden animate-slide-up ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-[10px] text-gray-600 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

function Analytics() {
  const dispatch = useDispatch()
  const employees = useSelector((s) => s.employees.employees)
  const departments = useSelector((s) => s.departments.departments)
  const users = useSelector((s) => s.users?.users || [])
  const orders = useSelector((s) => s.salesOrders?.orders || [])

  useEffect(() => {
    dispatch(fetchEmployees({ page: 0, size: 100 }))
    dispatch(fetchDepartments())
    dispatch(fetchUsers())
    dispatch(fetchSalesOrders({ page: 0, size: 100 }))
  }, [dispatch])

  const empList = isDevMode() ? fakeEmployees : employees
  const deptList = isDevMode() ? fakeDepartments : departments
  const userList = isDevMode() ? fakeUsers : users

  const deptColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444', '#6366f1']
  const departmentDistribution = deptList.map((d, i) => {
    const count = empList.filter((e) => e.department?.id === d.id).length
    const total = empList.length || 1
    return { name: d.name, value: Math.round((count / total) * 100), color: deptColors[i % deptColors.length] }
  }).filter((d) => d.value > 0)

  const statusCounts = userList.reduce((acc, u) => { acc[u.status] = (acc[u.status] || 0) + 1; return acc }, {})
  const statusBreakdown = [
    { status: 'Active', count: statusCounts.ACTIVE || 0, color: '#10b981' },
    { status: 'Inactive', count: statusCounts.INACTIVE || 0, color: '#6b7280' },
    { status: 'Locked', count: statusCounts.LOCKED || 0, color: '#ef4444' },
  ]

  const ordersByStatus = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-down">
        <h1 className="text-2xl font-bold text-gradient tracking-tight">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Comprehensive insights and performance metrics.</p>
      </div>

      {/* Row 1: Employee Growth (line) + Department Distribution (donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Employee Growth" subtitle="Cumulative headcount over 12 months" icon={FiTrendingUp} className="lg:col-span-2" delay={100}>
          <div className="h-[260px]">
            <LineChart data={employeeGrowth} label="value" color="#3b82f6" />
          </div>
        </ChartCard>

        <ChartCard title="Department Split" subtitle="Headcount by department" icon={FiPieChart} delay={200}>
          <div className="flex flex-col items-center gap-5">
            <DonutChart data={departmentDistribution} size={180} thickness={22} />
            <Legend items={departmentDistribution.map((d) => ({ label: d.name, color: d.color, value: `${d.value}%` }))} />
          </div>
        </ChartCard>
      </div>

      {/* Row 2: Monthly Hiring (bar) + Revenue vs Expenses (area) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Monthly Hiring" subtitle="New employees onboarded per month" icon={FiBarChart2} delay={300}>
          <div className="h-[240px]">
            <BarChart data={monthlyHiring} color="#8b5cf6" />
          </div>
        </ChartCard>

        <ChartCard title="Revenue vs Expenses" subtitle="Monthly financial overview" icon={FiTrendingUp} delay={400}>
          <div className="h-[240px]">
            <AreaChart
              data={revenueData}
              lines={[
                { key: 'revenue', color: '#10b981' },
                { key: 'expenses', color: '#ef4444' },
              ]}
            />
          </div>
          <div className="mt-4">
            <Legend items={[
              { label: 'Revenue', color: '#10b981' },
              { label: 'Expenses', color: '#ef4444' },
            ]} />
          </div>
        </ChartCard>
      </div>

      {/* Row 3: Weekly Activity (bar) + Performance Radials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Weekly Activity" subtitle="Tasks, meetings, and tickets" icon={FiActivity} delay={500}>
          <div className="h-[220px]">
            <BarChart
              data={weeklyActivity}
              barKey="tasks"
              color="#06b6d4"
            />
          </div>
          <div className="mt-4">
            <Legend items={[
              { label: 'Tasks', color: '#06b6d4' },
            ]} />
          </div>
        </ChartCard>

        <ChartCard title="Performance" subtitle="Key metrics at a glance" icon={FiBarChart2} className="lg:col-span-2" delay={600}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {performanceMetrics.map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-3">
                <RadialProgress value={m.value} total={m.total} color={m.color} size={100} thickness={7} />
                <span className="text-[11px] text-gray-500 font-medium text-center">{m.label}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Row 4: Status Breakdown (donut) + Top Performers (list) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="User Status" subtitle="Active, inactive, and locked accounts" icon={FiPieChart} delay={700}>
          <div className="flex flex-col items-center gap-5">
            <DonutChart data={statusBreakdown} size={160} thickness={20} />
            <Legend items={statusBreakdown.map((d) => ({ label: d.status, color: d.color, value: d.count }))} />
          </div>
        </ChartCard>

        <ChartCard title="Top Performers" subtitle="Highest scoring employees" icon={FiTrendingUp} className="lg:col-span-2" delay={800}>
          <div className="space-y-3">
            {topPerformers.map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors animate-slide-in-right" style={{ animationDelay: `${850 + i * 60}ms` }}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/15 to-violet-500/10 border border-white/[0.06] flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-blue-400">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-[11px] text-gray-500">{p.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" style={{ width: `${p.score}%` }} />
                  </div>
                  <span className="text-xs text-white font-semibold w-8 text-right">{p.score}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

export default Analytics
