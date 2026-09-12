import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { fetchUsers, createUser, updateUser, deleteUser, getUserRoles, assignRole, removeRole } from '../store/userThunks'
import { fetchRoles } from '../store/roleThunks'
import { clearCurrUser, clearCurrUserRoles, clearUserErrors } from '../store/userSlice'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import FormField from '../components/FormField'
import StatusBadge from '../components/StatusBadge'
import { FiUserCheck, FiUserX, FiLock, FiUnlock, FiShield } from 'react-icons/fi'

const createSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
    phone: Yup.string(),
    address: Yup.string(),
})

const updateSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string(),
    address: Yup.string(),
})

function Users() {
    const dispatch = useDispatch()
    const { users, loading, error, currUserRoles } = useSelector((state) => state.users)
    const { roles } = useSelector((state) => state.roles)

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [showRoleModal, setShowRoleModal] = useState(false)
    const [selected, setSelected] = useState(null)

    const perPage = 10
    const filtered = users.filter((u) =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    )
    const totalPages = Math.ceil(filtered.length / perPage)
    const paginated = filtered.slice((page - 1) * perPage, page * perPage)

    useEffect(() => {
        dispatch(fetchUsers())
        dispatch(fetchRoles())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(clearUserErrors())
        }
    }, [error, dispatch])

    const columns = [
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'status', label: 'Status' },
    ]

    const openAdd = () => { setSelected(null); setShowModal(true) }
    const openEdit = (row) => { setSelected(row); setShowModal(true) }
    const handleDelete = (row) => { setSelected(row); setShowDelete(true) }

    const openRoles = (row) => {
        setSelected(row)
        dispatch(getUserRoles(row.id))
        setShowRoleModal(true)
    }

    const confirmDelete = () => {
        dispatch(deleteUser(selected.id))
            .unwrap()
            .then(() => { toast.success('User deleted'); setShowDelete(false); setSelected(null) })
            .catch(() => toast.error('Delete failed'))
    }

    const handleAssignRole = (roleId) => {
        dispatch(assignRole({ userId: selected.id, roleId }))
            .unwrap()
            .then(() => { toast.success('Role assigned'); dispatch(getUserRoles(selected.id)) })
            .catch(() => toast.error('Failed'))
    }

    const handleRemoveRole = (roleId) => {
        dispatch(removeRole({ userId: selected.id, roleId }))
            .unwrap()
            .then(() => { toast.success('Role removed'); dispatch(getUserRoles(selected.id)) })
            .catch(() => toast.error('Failed'))
    }

    return (
        <div>
            <PageHeader title="Users" onAdd={openAdd} addLabel="Add User" />

            <div className="mb-4">
                <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : paginated.length === 0 ? (
                <EmptyState message="No users found" onAdd={openAdd} addLabel="Add User" />
            ) : (
                <>
                    <div className="w-full overflow-x-auto rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10">
                                    {columns.map((col) => (
                                        <th key={col.key} className="px-6 py-4 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">{col.label}</th>
                                    ))}
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-white/50 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {paginated.map((row) => (
                                    <tr key={row.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-white/80">{row.username}</td>
                                        <td className="px-6 py-4 text-white/80">{row.email}</td>
                                        <td className="px-6 py-4 text-white/80">{row.phone}</td>
                                        <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openRoles(row)} className="p-2 text-white/40 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors cursor-pointer" title="Manage Roles">
                                                    <FiShield className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => openEdit(row)} className="p-2 text-white/40 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer" title="Edit">
                                                    <FiUserCheck className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(row)} className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer" title="Delete">
                                                    <FiUserX className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                title={selected ? 'Edit User' : 'Add User'}
                onClose={() => { setShowModal(false); setSelected(null); dispatch(clearCurrUser()) }}
            >
                <Formik
                    enableReinitialize
                    initialValues={{
                        username: selected?.username || '',
                        email: selected?.email || '',
                        password: '',
                        phone: selected?.phone || '',
                        address: selected?.address || '',
                    }}
                    validationSchema={selected ? updateSchema : createSchema}
                    onSubmit={(values, { resetForm }) => {
                        const action = selected
                            ? updateUser({ id: selected.id, ...values })
                            : createUser(values)

                        dispatch(action)
                            .unwrap()
                            .then(() => {
                                toast.success(selected ? 'User updated' : 'User created')
                                setShowModal(false)
                                setSelected(null)
                                resetForm()
                            })
                            .catch(() => toast.error('Something went wrong'))
                    }}
                >
                    {({ errors, touched, handleChange, handleBlur, values }) => (
                        <Form>
                            <FormField label="Username" name="username" value={values.username} onChange={handleChange} onBlur={handleBlur} error={touched.username && errors.username} />
                            <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={touched.email && errors.email} />
                            {!selected && (
                                <FormField label="Password" name="password" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} error={touched.password && errors.password} />
                            )}
                            <FormField label="Phone" name="phone" value={values.phone} onChange={handleChange} onBlur={handleBlur} />
                            <FormField label="Address" name="address" as="textarea" value={values.address} onChange={handleChange} onBlur={handleBlur} />
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => { setShowModal(false); setSelected(null) }} className="px-4 py-2 text-sm text-white/60 border border-white/15 rounded-lg hover:bg-white/10 cursor-pointer">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-500/20 border border-blue-500/40 rounded-lg hover:bg-blue-500/30 cursor-pointer">{selected ? 'Update' : 'Create'}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>

            {/* Delete Confirm */}
            <ConfirmModal
                isOpen={showDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${selected?.username}"?`}
                onConfirm={confirmDelete}
                onCancel={() => { setShowDelete(false); setSelected(null) }}
            />

            {/* Role Management Modal */}
            <Modal
                isOpen={showRoleModal}
                title={`Roles — ${selected?.username || ''}`}
                onClose={() => { setShowRoleModal(false); setSelected(null); dispatch(clearCurrUserRoles()) }}
            >
                <div className="space-y-2">
                    {roles.map((role) => {
                        const assigned = currUserRoles.some((r) => r.id === role.id)
                        return (
                            <div key={role.id} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                                <div>
                                    <p className="text-sm text-white/80">{role.name}</p>
                                    <p className="text-xs text-white/40">{role.description}</p>
                                </div>
                                {assigned ? (
                                    <button onClick={() => handleRemoveRole(role.id)} className="px-3 py-1 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 cursor-pointer">Remove</button>
                                ) : (
                                    <button onClick={() => handleAssignRole(role.id)} className="px-3 py-1 text-xs text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/10 cursor-pointer">Assign</button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </Modal>
        </div>
    )
}

export default Users
