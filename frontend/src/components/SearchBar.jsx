import { FiSearch, FiX } from 'react-icons/fi'

function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative group glass rounded-xl overflow-hidden transition-all duration-300 focus-within:shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)]">
      <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-400 transition-colors duration-300" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-md text-gray-600 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

export default SearchBar
