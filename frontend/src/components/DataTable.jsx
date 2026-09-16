import { useEffect, useMemo, useRef, useState } from 'react'
import { FiChevronDown, FiChevronUp, FiColumns, FiDownload, FiFilter, FiList } from 'react-icons/fi'
import Pagination from './Pagination'

function cloneRowValue(v) {
  if (v == null) return ''
  if (typeof v === 'object') return v?.name ?? v?.label ?? JSON.stringify(v)
  return String(v)
}

function downloadCSV(filename, header, rows) {
  const text = [
    header.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','),
    ...rows.map((cells) =>
      cells.map((c) => `"${cloneRowValue(c).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')
  const blob = new Blob(['\uFEFF' + text], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function DataTable({
  columns,
  data = [],
  onRowClick,
  emptyMessage = 'No records found',
  dense = false,
  exportable = false,
  exportFilename = 'export',
  paginated = false,
  pageSize = 8,
  resetKey = '',
  filters = [],
  maxHeight = 520,
  external = false,
  page: pageProp = 1,
  totalPages,
  totalRecords,
  onPageChange,
  sortKey: sortKeyProp = null,
  sortDir: sortDirProp = 'asc',
  onSortChange,
}) {
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [hiddenKeys, setHiddenKeys] = useState(() => new Set())
  const [filterValues, setFilterValues] = useState({})
  const [columnsOpen, setColumnsOpen] = useState(false)
  const columnsRef = useRef(null)

  useEffect(() => { setPage(1) }, [resetKey])

  useEffect(() => {
    const onClick = (e) => {
      if (columnsRef.current && !columnsRef.current.contains(e.target)) setColumnsOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const filterDefs = useMemo(
    () => filters.map((f) => {
      const seen = new Map()
      data.forEach((row) => {
        const v = f.getValue?.(row) ?? row[f.key]
        if (v == null) return
        const label = f.valueLabel ? f.valueLabel(v) : String(v)
        if (!seen.has(label)) seen.set(label, v)
      })
      return { ...f, options: [...seen.values()] }
    }),
    [filters, data]
  )

  const filtered = useMemo(() => {
    if (filterDefs.length === 0) return data
    return data.filter((row) =>
      filterDefs.every((f) => {
        const active = filterValues[f.key]
        if (!active || active === '__all__') return true
        return (f.getValue?.(row) ?? row[f.key]) === active
      })
    )
  }, [data, filterDefs, filterValues])

  const sorted = useMemo(() => {
    if (external || !sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const va = cloneRowValue(a[sortKey]).toLowerCase()
      const vb = cloneRowValue(b[sortKey]).toLowerCase()
      const cmp = va.localeCompare(vb)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir, external])

  const visibleCols = useMemo(
    () => columns.filter((c) => !hiddenKeys.has(c.key) && c.label !== ''),
    [columns, hiddenKeys]
  )

  const effSortKey = external ? sortKeyProp : sortKey
  const effSortDir = external ? sortDirProp : sortDir

  const totalRecordsCount = external ? (totalRecords ?? 0) : sorted.length
  const totalPagesCount = external
    ? (totalPages ?? Math.max(1, Math.ceil(totalRecordsCount / pageSize)))
    : Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = external ? Math.min(pageProp || 1, totalPagesCount) : Math.min(page, totalPagesCount)
  const start = paginated ? (currentPage - 1) * pageSize : 0
  const paged = external ? sorted : (paginated ? sorted.slice(start, start + pageSize) : sorted)

  const toggleSort = (key) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc')
      else { setSortKey(null); setSortDir('asc') }
    } else { setSortKey(key); setSortDir('asc') }
  }

  const handleSort = (key) => {
    if (external && onSortChange) {
      const nextDir = effSortKey === key ? (effSortDir === 'asc' ? 'desc' : null) : 'asc'
      onSortChange(key, nextDir)
      return
    }
    toggleSort(key)
  }

  const handlePageChange = (p) => {
    if (external) onPageChange?.(p)
    else setPage(p)
  }

  const toggleColumn = (key) => {
    setHiddenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleExport = () => {
    const header = visibleCols.map((c) => c.label)
    const rows = sorted.map((row) =>
      visibleCols.map((c) => c.exportValue ? c.exportValue(row) : row[c.key])
    )
    downloadCSV(exportFilename, header, rows)
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4 animate-float">
            <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-400">{emptyMessage}</h3>
          <p className="text-xs text-gray-600 mt-1">Create a new record to get started.</p>
        </div>
      </div>
    )
  }

  const rowPad = dense ? 'py-2.5' : 'py-4'
  const cellPad = dense ? 'px-4 py-2.5' : 'px-5 py-3.5'

  return (
    <div className="glass rounded-2xl overflow-hidden animate-fade-in">
      {(filterDefs.length > 0 || exportable) && (
        <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 flex-wrap">
            {filterDefs.map((f) => (
              <div key={f.key} className="flex items-center gap-1.5">
                <FiFilter className="w-3 h-3 text-gray-600" />
                <select
                  value={filterValues[f.key] || '__all__'}
                  onChange={(e) => setFilterValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg pl-2.5 pr-7 py-2 text-xs text-gray-300 outline-none transition-colors cursor-pointer"
                >
                  <option value="__all__">{f.label}</option>
                  {f.options.map((opt) => (
                    <option key={String(opt)} value={opt}>
                      {f.valueLabel ? f.valueLabel(opt) : String(opt)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-500 tabular-nums">
              Showing <span className="text-gray-300">{totalRecordsCount === 0 ? 0 : start + 1}–{Math.min(start + pageSize, totalRecordsCount)}</span> of <span className="text-gray-300">{totalRecordsCount}</span>
            </span>

            {effSortKey && (
              <button
                onClick={() => external && onSortChange ? onSortChange(effSortKey, null) : setSortKey(null)}
                className="hidden sm:inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer"
              >
                <FiList className="w-3 h-3" /> Sorted
              </button>
            )}

            {exportable && totalRecordsCount > 0 && (
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer hover:text-white"
              >
                <FiDownload className="w-3.5 h-3.5" /> Export
              </button>
            )}

            <div className="relative" ref={columnsRef}>
              <button
                onClick={() => setColumnsOpen((o) => !o)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  columnsOpen
                    ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                    : 'text-gray-300 bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.06] hover:text-white'
                }`}
              >
                <FiColumns className="w-3.5 h-3.5" /> Columns
                <FiChevronDown className={`w-3 h-3 transition-transform duration-200 ${columnsOpen ? 'rotate-180' : ''}`} />
              </button>
              {columnsOpen && (
                <div className="absolute right-0 top-full pt-2 z-20">
                  <div className="glass-strong rounded-xl py-2 w-48 shadow-2xl shadow-black/60 animate-scale-in">
                    <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">Visible columns</p>
                    {columns.filter((c) => c.label).map((c) => (
                      <label key={c.key} className="flex items-center gap-2.5 px-4 py-1.5 hover:bg-white/[0.04] cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={!hiddenKeys.has(c.key)}
                          onChange={() => toggleColumn(c.key)}
                          className="w-3.5 h-3.5 accent-blue-500 cursor-pointer"
                        />
                        <span className={`text-xs ${hiddenKeys.has(c.key) ? 'text-gray-600' : 'text-gray-300'}`}>{c.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto" style={{ maxHeight }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="sticky top-0 z-10 bg-[#06060b]/95 backdrop-blur-xl border-b border-white/[0.06]">
              {visibleCols.map((col) => {
                const sortable = col.sortable === true || (col.sortable !== false && !!col.key && col.label !== '')
                const active = effSortKey === col.key
                return (
                  <th
                    key={col.key}
                    className={`${cellPad} ${col.align === 'right' ? 'text-right' : 'text-left'} text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] whitespace-nowrap ${col.width ? `w-[${col.width}]` : ''}`}
                  >
                    {sortable ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className={`inline-flex items-center gap-1 uppercase tracking-[0.15em] transition-colors cursor-pointer ${active ? 'text-blue-400' : 'hover:text-gray-300'}`}
                      >
                        {col.label}
                        {active
                          ? (effSortDir === 'asc' ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />)
                          : <FiChevronDown className="w-3 h-3 opacity-40" />}
                      </button>
                    ) : col.label}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {paged.map((row, rowIdx) => (
              <tr
                key={row.id ?? rowIdx}
                onClick={() => onRowClick?.(row)}
                className={`group transition-colors duration-150 odd:bg-white/[0.015] animate-slide-in-right ${
                  onRowClick ? 'cursor-pointer hover:bg-white/[0.04]' : 'hover:bg-white/[0.03]'
                }`}
                style={{ animationDelay: `${rowIdx * 30}ms` }}
              >
                {visibleCols.map((col) => (
                  <td key={col.key} className={`${rowPad} ${cellPad} text-gray-300 ${col.align === 'right' ? 'text-right' : 'text-left'} whitespace-nowrap`}>
                    {col.render ? col.render(row[col.key], row) : (
                      <span className={col.primary ? 'text-white font-semibold' : ''}>
                        {col.align === 'right' ? cloneRowValue(row[col.key]) : cloneRowValue(row[col.key])}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginated && totalPagesCount > 1 && (
        <div className="px-5 py-4 border-t border-white/[0.06]">
          <Pagination currentPage={currentPage} totalPages={totalPagesCount} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}

export default DataTable