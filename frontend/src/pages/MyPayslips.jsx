import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiDollarSign, FiPrinter } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { fetchMyPayslips } from '../store/payslipThunks'
import { formatCurrency, formatDate } from '../utils/format'

function PayslipDetail({ payslip, onPrint }) {
  if (!payslip) return null

  const earnings = [
    { label: 'Basic Salary', value: payslip.basicSalary },
    { label: 'Allowances', value: payslip.allowances },
  ].filter((r) => r.value != null)

  const deductions = [
    { label: 'Deductions', value: payslip.deductions },
    { label: 'Tax', value: payslip.tax },
  ].filter((r) => r.value != null)

  return (
    <div className="space-y-5">
      <div className="payslip-print">
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-white/[0.06]">
            <div>
              <h3 className="text-lg font-bold text-white">{payslip.employeeName}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{payslip.employeeEmail}</p>
              <p className="text-xs text-gray-400 mt-1">{payslip.jobTitle} · {payslip.departmentName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-blue-400">{payslip.periodLabel}</p>
              <div className="mt-2"><StatusBadge status={payslip.runStatus} /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Earnings</h4>
              <table className="w-full text-sm">
                <tbody>
                  {earnings.map((row) => (
                    <tr key={row.label} className="border-b border-white/[0.04]">
                      <td className="py-2 text-gray-400">{row.label}</td>
                      <td className="py-2 text-right text-emerald-400 font-medium">{formatCurrency(row.value)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-2 text-gray-300 font-semibold">Gross Earnings</td>
                    <td className="py-2 text-right text-emerald-400 font-bold">{formatCurrency(payslip.grossEarnings)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Deductions</h4>
              <table className="w-full text-sm">
                <tbody>
                  {deductions.map((row) => (
                    <tr key={row.label} className="border-b border-white/[0.04]">
                      <td className="py-2 text-gray-400">{row.label}</td>
                      <td className="py-2 text-right text-red-400 font-medium">{formatCurrency(row.value)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-2 text-gray-300 font-semibold">Total Deductions</td>
                    <td className="py-2 text-right text-red-400 font-bold">{formatCurrency(payslip.totalDeductions)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Net Pay</p>
              <p className="text-[11px] text-gray-600 mt-0.5">Generated {formatDate(payslip.generatedAt)}{payslip.processedByName ? ` · by ${payslip.processedByName}` : ''}</p>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{formatCurrency(payslip.netPay)}</p>
          </div>

          {payslip.notes && (
            <p className="mt-4 text-xs text-gray-500 italic">{payslip.notes}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 cursor-pointer"
        >
          <FiPrinter className="w-4 h-4" /> Print
        </button>
      </div>
    </div>
  )
}

function MyPayslips() {
  const dispatch = useDispatch()
  const { myPayslips, loading } = useSelector((s) => s.payslips)
  const [year, setYear] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const params = {}
    if (year) params.year = Number(year)
    dispatch(fetchMyPayslips(params))
  }, [dispatch, year])

  const handlePrint = () => {
    const styleId = 'payslip-print-style'
    if (!document.getElementById(styleId)) {
      const el = document.createElement('style')
      el.id = styleId
      el.textContent = `@media print {
        body * { visibility: hidden !important; }
        .payslip-print, .payslip-print * { visibility: visible !important; }
        .payslip-print { position: absolute; left: 0; top: 0; width: 100%; padding: 0; background: #fff; }
      }`
      document.head.appendChild(el)
    }
    window.print()
  }

  const columns = [
    { key: 'periodLabel', label: 'Period', render: (val) => <span className="text-white font-semibold text-sm">{val}</span> },
    { key: 'runStatus', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'grossEarnings', label: 'Gross', render: (val) => <span className="text-emerald-400 font-medium">{formatCurrency(val)}</span> },
    { key: 'totalDeductions', label: 'Deductions', render: (val) => <span className="text-red-400 font-medium">{formatCurrency(val)}</span> },
    { key: 'netPay', label: 'Net Pay', render: (val) => <span className="text-white font-bold">{formatCurrency(val)}</span> },
    { key: 'generatedAt', label: 'Generated', render: formatDate },
  ]

  const selectCls = "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl pl-3 pr-8 py-2.5 text-sm text-gray-300 outline-none transition-colors cursor-pointer"

  return (
    <div>
      <PageHeader title="My Payslips" subtitle="View and download your payslips" icon={FiDollarSign} />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select value={year} onChange={(e) => setYear(e.target.value)} className={selectCls}>
          <option value="">All Years</option>
          {[2026, 2025, 2024].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {loading && myPayslips.length === 0 ? <LoadingSpinner /> : myPayslips.length === 0 ? (
        <EmptyState title="No payslips found" description="Payslips will appear here once payroll is processed." />
      ) : (
        <DataTable
          columns={columns}
          data={myPayslips}
          onRowClick={(row) => setSelected(row)}
          paginated
          pageSize={8}
          resetKey={String(year)}
          exportable
          exportFilename="my-payslips"
        />
      )}

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Payslip Details"
        subtitle={selected?.periodLabel}
        size="lg"
      >
        <PayslipDetail payslip={selected} onPrint={handlePrint} />
      </Modal>
    </div>
  )
}

export default MyPayslips
