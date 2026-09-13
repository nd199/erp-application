import { useEffect } from 'react'
import { FiX } from 'react-icons/fi'

function Modal({ isOpen, onClose, title, subtitle, children, size = 'md' }) {
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`relative w-full ${widths[size]} animate-scale-in`}>
        {/* Glow behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-violet-600/10 rounded-3xl blur-xl opacity-50" />

        <div className="relative glass-strong rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">
          {/* Top gradient edge */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-0">
            <div>
              <h2 className="text-lg font-bold text-gradient">{title}</h2>
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.06] border border-white/[0.06] transition-all duration-200 cursor-pointer hover:rotate-90"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="mx-6 mt-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          {/* Body */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
