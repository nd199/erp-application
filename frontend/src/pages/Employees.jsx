import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../store/employeeThunks'
import { fetchDepartments } from '../store/departmentThunks'
import { clearCurrEmployee, clearCurrErrors } from '../store/employeeSlice'
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

const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string(),
    hireDate: Yup.date().required('Hire date is required'),
    jobTitle: Yup.string().required('Job title is required'),
    departmentId: Yup.string().required('Department is required'),
    status: Yup.string().required('Status is required'),
})

function Employees() {
    const dispatch = useDispatch()
    const { employees, loading, error } = useSelector((state) => state.employees)
    const { departments } = useSelector((state) => state.departments)

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [selected, setSelected] = useState(null)

    const perPage = 10
    const filtered = employees.filter((e) =>
        e.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        e.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        e.email?.toLowerCase().includes(search.toLowerCase())
    )
    const totalPages = Math.ceil(filtered.length / perPage)
    const paginated = filtered.slice((page - 1) * perPage, page * perPage)

    const deptOptions = departments.map((d) => ({ value: String(d.id), label: d.name }))

    useEffect(() => {
        dispatch(fetchEmployees())
        dispatch(fetchDepartments())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(clearCurrErrors())
        }
    }, [error, dispatch])

    const columns = [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'jobTitle', label: 'Job Title' },
        { key: 'status', label: 'Status' },
    ]

    const openAdd = () => { setSelected(null); setShowModal(true) }
    const openEdit = (row) => { setSelected(row); setShowModal(true) }
    const handleDelete = (row) => { setSelected(row); setShowDelete(true) }

    const confirmDelete = () => {
        dispatch(deleteEmployee(selected.id))
            .unwrap()
            .then(() => { toast.success('Employee deleted'); setShowDelete(false); setSelected(null) })
            .catch(() => toast.error('Delete failed'))
    }

    return (
        <div>
            <PageHeader title="Employees" onAdd={openAdd} addLabel="Add Employee" />

            <div className="mb-4">
                <SearchBar value={search} onChange={setSearch} placeholder="Search employees..." />
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : paginated.length === 0 ? (
                <EmptyState message="No employees found" onAdd={openAdd} addLabel="Add Employee" />
            ) : (
                <>
                    <DataTable columns={columns} data={paginated} onEdit={openEdit} onDelete={handleDelete} />
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                title={selected ? 'Edit Employee' : 'Add Employee'}
                onClose={() => { setShowModal(false); setSelected(null); dispatch(clearCurrEmployee()) }}
            >
                <Formik
                    enableReinitialize
                    initialValues={{
                        firstName: selected?.firstName || '',
                        lastName: selected?.lastName || '',
                        email: selected?.email || '',
                        phone: selected?.phone || '',
                        hireDate: selected?.hireDate || '',
                        jobTitle: selected?.jobTitle || '',
                        departmentId: selected?.departmentId || '',
                        status: selected?.status || 'ACTIVE',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        const action = selected
                            ? updateEmployee({ id: selected.id, ...values })
                            : createEmployee(values)

                        dispatch(action)
                            .unwrap()
                            .then(() => {
                                toast.success(selected ? 'Employee updated' : 'Employee created')
                                setShowModal(false)
                                setSelected(null)
                                resetForm()
                            })
                            .catch(() => toast.error('Something went wrong'))
                    }}
                >
                    {({ errors, touched, handleChange, handleBlur, values }) => (
                        <Form>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="First Name" name="firstName" value={values.firstName} onChange={handleChange} onBlur={handleBlur} error={touched.firstName && errors.firstName} />
                                <FormField label="Last Name" name="lastName" value={values.lastName} onChange={handleChange} onBlur={handleBlur} error={touched.lastName && errors.lastName} />
                            </div>
                            <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={touched.email && errors.email} />
                            <FormField label="Phone" name="phone" value={values.phone} onChange={handleChange} onBlur={handleBlur} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Hire Date" name="hireDate" type="date" value={values.hireDate} onChange={handleChange} onBlur={handleBlur} error={touched.hireDate && errors.hireDate} />
                                <FormField label="Job Title" name="jobTitle" value={values.jobTitle} onChange={handleChange} onBlur={handleBlur} error={touched.jobTitle && errors.jobTitle} />
                            </div>
                            <FormField label="Department" name="departmentId" as="select" options={deptOptions} value={values.departmentId} onChange={handleChange} onBlur={handleBlur} error={touched.departmentId && errors.departmentId} />
                            <FormField label="Status" name="status" as="select" options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }]} value={values.status} onChange={handleChange} onBlur={handleBlur} error={touched.status && errors.status} />
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
                title="Delete Employee"
                message={`Are you sure you want to delete "${selected?.firstName} ${selected?.lastName}"?`}
                onConfirm={confirmDelete}
                onCancel={() => { setShowDelete(false); setSelected(null) }}
            />
        </div>
    )
}

export default Employees
