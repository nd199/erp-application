import { FiAlertTriangle } from 'react-icons/fi'

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading = false }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600/10 to-orange-600/10 rounded-3xl blur-xl opacity-50" />

        <div className="relative glass-strong rounded-3xl shadow-2xl shadow-black/60 p-6 overflow-hidden">
          {/* Top gradient edge */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 animate-bounce-in shrink-0">
              <FiAlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gradient">{title}</h3>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl transition-all duration-300 shadow-lg shadow-red-600/20 hover:shadow-red-500/30 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
