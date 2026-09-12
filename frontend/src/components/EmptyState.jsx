import { FiInbox } from 'react-icons/fi'

function EmptyState({ message = 'No data found', onAdd, addLabel }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-white/10 bg-white/5">
            <FiInbox className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/50 text-sm mb-4">{message}</p>
            {onAdd && (
                <button
                    onClick={onAdd}
                    className="px-4 py-2 text-sm font-medium text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer"
                >
                    {addLabel || 'Add New'}
                </button>
            )}
        </div>
    )
}

export default EmptyState
