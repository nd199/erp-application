function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
      <div className={`relative ${sizes[size]}`}>
        <div className="absolute inset-0 rounded-full border-[1.5px] border-white/[0.06]" />
        <div className="absolute inset-0 rounded-full border-[1.5px] border-transparent border-t-blue-500 animate-spin" />
        <div className="absolute inset-1 rounded-full border-[1.5px] border-transparent border-t-violet-500 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-md" />
      </div>
      <p className="text-xs text-gray-600 font-medium">Loading...</p>
    </div>
  )
}

export default LoadingSpinner
