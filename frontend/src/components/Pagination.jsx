import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visible = pages.filter((p) => {
    if (p === 1 || p === totalPages) return true
    if (Math.abs(p - currentPage) <= 1) return true
    return false
  })

  return (
    <div className="flex items-center justify-center gap-1 mt-6 animate-fade-in">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl text-gray-600 hover:text-white hover:bg-white/[0.04] disabled:opacity-20 disabled:hover:bg-transparent transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
      >
        <FiChevronLeft className="w-4 h-4" />
      </button>

      {visible.map((page, i) => {
        const prev = visible[i - 1]
        const showEllipsis = prev && page - prev > 1
        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && <span className="text-gray-700 text-xs px-1">...</span>}
            <button
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                currentPage === page
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-600 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {page}
            </button>
          </span>
        )
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl text-gray-600 hover:text-white hover:bg-white/[0.04] disabled:opacity-20 disabled:hover:bg-transparent transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
      >
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Pagination
