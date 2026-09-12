import { FiEdit2, FiTrash2 } from 'react-icons/fi'

function DataTable({ columns, data, onEdit, onDelete }) {
    if (!data || data.length === 0) {
        return null
    }

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-white/10">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-6 py-4 text-left text-xs font-semibold text-white/50 uppercase tracking-wider"
                            >
                                {col.label}
                            </th>
                        ))}
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/50 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                    {data.map((row, index) => (
                        <tr
                            key={row.id || index}
                            className="hover:bg-white/5 transition-colors"
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className="px-6 py-4 text-white/80 whitespace-nowrap"
                                >
                                    {row[col.key]}
                                </td>
                            ))}
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(row)}
                                        className="p-2 text-white/40 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <FiEdit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(row)}
                                        className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DataTable
