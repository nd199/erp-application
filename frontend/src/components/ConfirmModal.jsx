import { useEffect } from 'react'

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onCancel()
        }
        if (isOpen) document.addEventListener('keydown', handleEsc)
        return () => document.removeEventListener('keydown', handleEsc)
    }, [isOpen, onCancel])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={onCancel}
            />

            <div className="relative w-full max-w-md mx-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-red-500 via-orange-400 to-red-500" />

                <div className="px-8 py-7">
                    <div className="flex justify-center mb-5">
                        <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-white text-center mb-2">{title}</h2>
                    <p className="text-white/60 text-center text-sm leading-relaxed">{message}</p>
                </div>

                <div className="px-8 pb-7 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-5 py-3 text-sm font-semibold text-white/80 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 transition-all duration-200 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-5 py-3 text-sm font-semibold text-white rounded-xl border border-red-500/40 bg-red-500/20 hover:bg-red-500/30 hover:border-red-500/60 transition-all duration-200 shadow-[0_0_15px_rgba(239,68,68,0.15)] cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
