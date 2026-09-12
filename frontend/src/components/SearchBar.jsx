import { useState, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'

function SearchBar({ value, onChange, placeholder = 'Search...' }) {
    const [local, setLocal] = useState(value)

    useEffect(() => {
        setLocal(value)
    }, [value])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (local !== value) {
                onChange(local)
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [local])

    return (
        <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
                type="text"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2.5 text-sm text-white/80 placeholder-white/30 rounded-xl border border-white/15 bg-white/5 backdrop-blur-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
            />
        </div>
    )
}

export default SearchBar
