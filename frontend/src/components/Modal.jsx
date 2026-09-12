import { useEffect } from 'react'

function Modal({ isOpen, title, onClose, children, footer }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) document.addEventListener('keydown', handleEsc)
        return () => document.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-500" />

                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        &times;
                    </button>
                </div>

                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
                    {children}
                </div>

                {footer && (
                    <div className="px-6 py-4 border-t border-white/10">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Modal
