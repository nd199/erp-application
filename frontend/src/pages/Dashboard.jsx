import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmployees } from '../store/employeeThunks'
import { fetchDepartments } from '../store/departmentThunks'
import { fetchUsers } from '../store/userThunks'
import { fetchRoles } from '../store/roleThunks'
import { fetchPermissions } from '../store/permissionThunks'
import { FiUsers, FiHome, FiUser, FiShield, FiKey } from 'react-icons/fi'

function Dashboard() {
    const dispatch = useDispatch()
    const { employees } = useSelector((state) => state.employees)
    const { departments } = useSelector((state) => state.departments)
    const { users } = useSelector((state) => state.users)
    const { roles } = useSelector((state) => state.roles)
    const { permissions } = useSelector((state) => state.permissions)

    useEffect(() => {
        dispatch(fetchEmployees())
        dispatch(fetchDepartments())
        dispatch(fetchUsers())
        dispatch(fetchRoles())
        dispatch(fetchPermissions())
    }, [dispatch])

    const stats = [
        { label: 'Employees', count: employees.length, icon: FiUsers, color: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30', iconColor: 'text-blue-400' },
        { label: 'Departments', count: departments.length, icon: FiHome, color: 'from-green-500/20 to-green-600/20', border: 'border-green-500/30', iconColor: 'text-green-400' },
        { label: 'Users', count: users.length, icon: FiUser, color: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/30', iconColor: 'text-purple-400' },
        { label: 'Roles', count: roles.length, icon: FiKey, color: 'from-yellow-500/20 to-yellow-600/20', border: 'border-yellow-500/30', iconColor: 'text-yellow-400' },
        { label: 'Permissions', count: permissions.length, icon: FiShield, color: 'from-red-500/20 to-red-600/20', border: 'border-red-500/30', iconColor: 'text-red-400' },
    ]

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.color} backdrop-blur-xl p-6`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                        </div>
                        <p className="text-3xl font-bold text-white">{stat.count}</p>
                        <p className="text-sm text-white/50 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Dashboard
