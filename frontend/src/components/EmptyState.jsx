import { FiInbox } from 'react-icons/fi'

function EmptyState({ icon: Icon = FiInbox, title = 'No data found', description = 'There are no records to display.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center animate-float">
          <Icon className="w-8 h-8 text-gray-600" />
        </div>
        <div className="absolute inset-0 rounded-3xl bg-white/[0.02] blur-xl" />
      </div>
      <h3 className="text-sm font-semibold text-gray-400 mb-1">{title}</h3>
      <p className="text-xs text-gray-600 max-w-[240px] text-center leading-relaxed">{description}</p>
    </div>
  )
}

export default EmptyState
