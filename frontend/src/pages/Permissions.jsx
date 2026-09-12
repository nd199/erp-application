import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { fetchPermissions, createPermission, updatePermission, deletePermission } from '../store/permissionThunks'
import { clearCurrPermission, clearPermissionErrors } from '../store/permissionSlice'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import FormField from '../components/FormField'

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
})

function Permissions() {
    const dispatch = useDispatch()
    const { permissions, loading, error } = useSelector((state) => state.permissions)

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [selected, setSelected] = useState(null)

    const perPage = 10
    const filtered = permissions.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
    )
    const totalPages = Math.ceil(filtered.length / perPage)
    const paginated = filtered.slice((page - 1) * perPage, page * perPage)

    useEffect(() => {
        dispatch(fetchPermissions())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(clearPermissionErrors())
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

    const openEdit = (row) => {
        setSelected(row)
        setShowModal(true)
    }

    const handleDelete = (row) => {
        setSelected(row)
        setShowDelete(true)
    }

    const confirmDelete = () => {
        dispatch(deletePermission(selected.id))
            .unwrap()
            .then(() => {
                toast.success('Permission deleted')
                setShowDelete(false)
                setSelected(null)
            })
            .catch(() => toast.error('Delete failed'))
    }

    return (
        <div>
            <PageHeader title="Permissions" onAdd={openAdd} addLabel="Add Permission" />

            <div className="mb-4">
                <SearchBar value={search} onChange={setSearch} placeholder="Search permissions..." />
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : paginated.length === 0 ? (
                <EmptyState message="No permissions found" onAdd={openAdd} addLabel="Add Permission" />
            ) : (
                <>
                    <DataTable columns={columns} data={paginated} onEdit={openEdit} onDelete={handleDelete} />
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                title={selected ? 'Edit Permission' : 'Add Permission'}
                onClose={() => { setShowModal(false); setSelected(null); dispatch(clearCurrPermission()) }}
            >
                <Formik
                    enableReinitialize
                    initialValues={{
                        name: selected?.name || '',
                        description: selected?.description || '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        const action = selected
                            ? updatePermission({ id: selected.id, ...values })
                            : createPermission(values)

                        dispatch(action)
                            .unwrap()
                            .then(() => {
                                toast.success(selected ? 'Permission updated' : 'Permission created')
                                setShowModal(false)
                                setSelected(null)
                                resetForm()
                            })
                            .catch(() => toast.error('Something went wrong'))
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
                                    onClick={() => { setShowModal(false); setSelected(null) }}
                                    className="px-4 py-2 text-sm text-white/60 border border-white/15 rounded-lg hover:bg-white/10 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-500/20 border border-blue-500/40 rounded-lg hover:bg-blue-500/30 cursor-pointer"
                                >
                                    {selected ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>

            {/* Delete Confirm */}
            <ConfirmModal
                isOpen={showDelete}
                title="Delete Permission"
                message={`Are you sure you want to delete "${selected?.name}"?`}
                onConfirm={confirmDelete}
                onCancel={() => { setShowDelete(false); setSelected(null) }}
            />
        </div>
    )
}

export default Permissions
