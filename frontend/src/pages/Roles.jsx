import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { fetchRoles, createRole, getRolePermissions, assignPermission, removePermission } from '../store/roleThunks'
import { fetchPermissions } from '../store/permissionThunks'
import { clearCurrRole, clearCurrRolePermissions, clearRoleErrors } from '../store/roleSlice'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import { FiShield } from 'react-icons/fi'

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
})

function Roles() {
    const dispatch = useDispatch()
    const { roles, loading, error, currRolePermissions } = useSelector((state) => state.roles)
    const { permissions } = useSelector((state) => state.permissions)

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [showPermModal, setShowPermModal] = useState(false)
    const [selected, setSelected] = useState(null)

    const perPage = 10
    const filtered = roles.filter((r) =>
        r.name?.toLowerCase().includes(search.toLowerCase())
    )
    const totalPages = Math.ceil(filtered.length / perPage)
    const paginated = filtered.slice((page - 1) * perPage, page * perPage)

    useEffect(() => {
        dispatch(fetchRoles())
        dispatch(fetchPermissions())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(clearRoleErrors())
        }
    }, [error, dispatch])

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
    ]

    const openAdd = () => {
        setSelected(null)
        setShowModal(true)
    }

    const openPermissions = (row) => {
        setSelected(row)
        dispatch(getRolePermissions(row.id))
        setShowPermModal(true)
    }

    const handleAssignPerm = (permId) => {
        dispatch(assignPermission({ roleId: selected.id, permissionId: permId }))
            .unwrap()
            .then(() => {
                toast.success('Permission assigned')
                dispatch(getRolePermissions(selected.id))
            })
            .catch(() => toast.error('Failed'))
    }

    const handleRemovePerm = (permId) => {
        dispatch(removePermission({ roleId: selected.id, permissionId: permId }))
            .unwrap()
            .then(() => {
                toast.success('Permission removed')
                dispatch(getRolePermissions(selected.id))
            })
            .catch(() => toast.error('Failed'))
    }

    return (
        <div>
            <PageHeader title="Roles" onAdd={openAdd} addLabel="Add Role" />

            <div className="mb-4">
                <SearchBar value={search} onChange={setSearch} placeholder="Search roles..." />
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : paginated.length === 0 ? (
                <EmptyState message="No roles found" onAdd={openAdd} addLabel="Add Role" />
            ) : (
                <>
                    <DataTable columns={columns} data={paginated} onEdit={openPermissions} onDelete={() => {}} />
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}

            {/* Add Role Modal */}
            <Modal
                isOpen={showModal}
                title="Add Role"
                onClose={() => { setShowModal(false); setSelected(null) }}
            >
                <Formik
                    initialValues={{ name: '', description: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        dispatch(createRole(values))
                            .unwrap()
                            .then(() => {
                                toast.success('Role created')
                                setShowModal(false)
                                resetForm()
                            })
                            .catch(() => toast.error('Create failed'))
                    }}
                >
                    {({ errors, touched, handleChange, handleBlur, values }) => (
                        <Form>
                            <FormField
                                label="Name"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.name && errors.name}
                            />
                            <FormField
                                label="Description"
                                name="description"
                                as="textarea"
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.description && errors.description}
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm text-white/60 border border-white/15 rounded-lg hover:bg-white/10 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-500/20 border border-blue-500/40 rounded-lg hover:bg-blue-500/30 cursor-pointer"
                                >
                                    Create
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>

            {/* Permissions Modal */}
            <Modal
                isOpen={showPermModal}
                title={`Permissions — ${selected?.name || ''}`}
                onClose={() => { setShowPermModal(false); setSelected(null); dispatch(clearCurrRolePermissions()) }}
            >
                <div className="space-y-2">
                    {permissions.map((perm) => {
                        const assigned = currRolePermissions.some((p) => p.id === perm.id)
                        return (
                            <div key={perm.id} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                                <div className="flex items-center gap-3">
                                    <FiShield className="text-white/30" />
                                    <div>
                                        <p className="text-sm text-white/80">{perm.name}</p>
                                        <p className="text-xs text-white/40">{perm.description}</p>
                                    </div>
                                </div>
                                {assigned ? (
                                    <button
                                        onClick={() => handleRemovePerm(perm.id)}
                                        className="px-3 py-1 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAssignPerm(perm.id)}
                                        className="px-3 py-1 text-xs text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/10 cursor-pointer"
                                    >
                                        Assign
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </Modal>
        </div>
    )
}

export default Roles
