function PageHeader({ title, subtitle, icon: Icon, actionLabel, onAction, actionIcon: ActionIcon }) {
  return (
    <div className="flex items-center justify-between mb-8 animate-slide-down">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="relative group">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/15 to-violet-500/10 border border-white/[0.08] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Icon className="w-5 h-5 text-blue-400" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-blue-500/15 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gradient tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {actionLabel && (
        <button
          onClick={onAction}
          className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          {ActionIcon && <ActionIcon className="w-4 h-4 relative" />}
          <span className="relative">{actionLabel}</span>
        </button>
      )}
    </div>
  )
}

export default PageHeader
