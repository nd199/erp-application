import { FiPlus } from 'react-icons/fi'

function PageHeader({ title, onAdd, addLabel = 'Add New' }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {onAdd && (
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl border border-blue-500/40 bg-blue-500/20 hover:bg-blue-500/30 hover:border-blue-500/60 transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)] cursor-pointer"
                >
                    <FiPlus className="w-4 h-4" />
                    {addLabel}
                </button>
            )}
        </div>
    )
}

export default PageHeader
