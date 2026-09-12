import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
                <FiChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                        page === currentPage
                            ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
                            : 'text-white/50 hover:text-white hover:bg-white/10'
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
                <FiChevronRight className="w-5 h-5" />
            </button>
        </div>
    )
}

export default Pagination
