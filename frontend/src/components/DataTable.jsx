function DataTable({ columns, data, onRowClick, emptyMessage = 'No records found' }) {
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

  return (
    <div className="glass rounded-2xl overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                onClick={() => onRowClick?.(row)}
                className={`group transition-all duration-200 animate-slide-in-right ${
                  onRowClick
                    ? 'cursor-pointer hover:bg-white/[0.03]'
                    : ''
                }`}
                style={{ animationDelay: `${rowIdx * 30}ms` }}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 text-gray-300">
                    {col.render ? col.render(row[col.key], row) : (
                      <span className={col.primary ? 'text-white font-semibold' : ''}>
                        {row[col.key]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
