import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment } from '../store/departmentThunks'
import { clearCurrDepartment, clearDeptErrors } from '../store/departmentSlice'
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

function Departments() {
    const dispatch = useDispatch()
    const { departments, loading, error } = useSelector((state) => state.departments)

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [selected, setSelected] = useState(null)

    const perPage = 10
    const filtered = departments.filter((d) =>
        d.name?.toLowerCase().includes(search.toLowerCase())
    )
    const totalPages = Math.ceil(filtered.length / perPage)
    const paginated = filtered.slice((page - 1) * perPage, page * perPage)

    useEffect(() => {
        dispatch(fetchDepartments())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(clearDeptErrors())
        }
    }, [error, dispatch])

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
    ]

    const openAdd = () => { setSelected(null); setShowModal(true) }
    const openEdit = (row) => { setSelected(row); setShowModal(true) }
    const handleDelete = (row) => { setSelected(row); setShowDelete(true) }

    const confirmDelete = () => {
        dispatch(deleteDepartment(selected.id))
            .unwrap()
            .then(() => { toast.success('Department deleted'); setShowDelete(false); setSelected(null) })
            .catch(() => toast.error('Delete failed'))
    }

    return (
        <div>
            <PageHeader title="Departments" onAdd={openAdd} addLabel="Add Department" />

            <div className="mb-4">
                <SearchBar value={search} onChange={setSearch} placeholder="Search departments..." />
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : paginated.length === 0 ? (
                <EmptyState message="No departments found" onAdd={openAdd} addLabel="Add Department" />
            ) : (
                <>
                    <DataTable columns={columns} data={paginated} onEdit={openEdit} onDelete={handleDelete} />
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                title={selected ? 'Edit Department' : 'Add Department'}
                onClose={() => { setShowModal(false); setSelected(null); dispatch(clearCurrDepartment()) }}
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
                            ? updateDepartment({ id: selected.id, ...values })
                            : createDepartment(values)

                        dispatch(action)
                            .unwrap()
                            .then(() => {
                                toast.success(selected ? 'Department updated' : 'Department created')
                                setShowModal(false)
                                setSelected(null)
                                resetForm()
                            })
                            .catch(() => toast.error('Something went wrong'))
                    }}
                >
                    {({ errors, touched, handleChange, handleBlur, values }) => (
                        <Form>
                            <FormField label="Name" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} error={touched.name && errors.name} />
                            <FormField label="Description" name="description" as="textarea" value={values.description} onChange={handleChange} onBlur={handleBlur} error={touched.description && errors.description} />
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
                title="Delete Department"
                message={`Are you sure you want to delete "${selected?.name}"?`}
                onConfirm={confirmDelete}
                onCancel={() => { setShowDelete(false); setSelected(null) }}
            />
        </div>
    )
}

export default Departments
