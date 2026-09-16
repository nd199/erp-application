function Avatar({ src, name = '', size = 'md', className = '' }) {
  const initials = (name || '? ?').split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()

  const sizes = {
    sm: 'w-9 h-9 text-[10px]',
    md: 'w-12 h-12 text-xs',
    lg: 'w-16 h-16 text-sm',
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/10 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-blue-400">{initials}</span>
      )}
    </div>
  )
}

export default Avatar