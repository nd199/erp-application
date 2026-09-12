function LoadingSpinner({ text = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-white/50 text-sm">{text}</p>
        </div>
    )
}

export default LoadingSpinner
