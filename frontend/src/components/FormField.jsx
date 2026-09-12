function FormField({ label, name, type = 'text', as = 'input', options, error, ...props }) {
    const baseClasses = `w-full px-4 py-2.5 text-sm text-white/80 placeholder-white/30 rounded-xl border bg-white/5 backdrop-blur-xl focus:outline-none transition-all ${
        error
            ? 'border-red-500/50 focus:border-red-500/70'
            : 'border-white/15 focus:border-blue-500/50'
    }`

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-white/60 mb-1.5">
                {label}
            </label>

            {as === 'select' ? (
                <select name={name} className={baseClasses} {...props}>
                    <option value="">Select {label}</option>
                    {options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : as === 'textarea' ? (
                <textarea
                    name={name}
                    rows={4}
                    className={baseClasses}
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    className={baseClasses}
                    {...props}
                />
            )}

            {error && (
                <p className="mt-1 text-xs text-red-400">{error}</p>
            )}
        </div>
    )
}

export default FormField
