import { useRef, useState } from 'react'
import { FiCamera, FiTrash2, FiUpload, FiShuffle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Avatar from './Avatar'
import { randomAvatar } from '../lib/avatars'

const MAX_SIZE = 1 * 1024 * 1024

function ImageUpload({ value, onChange, name = '', size = 96 }) {
  const fileRef = useRef(null)
  const cameraRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return
    }
    if (file.size > MAX_SIZE) {
      toast.error('Image must be under 1MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-4">
      <div
        className="relative"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]) }}
      >
        <div className={`rounded-full overflow-hidden ring-1 transition-all duration-200 ${dragOver ? 'ring-blue-400/60 scale-105' : 'ring-white/10'}`} style={{ width: size, height: size }}>
          <Avatar src={value} name={name} />
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-500/40 transition-all cursor-pointer"
            title="Remove photo"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-white">Profile Photo</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer"
          >
            <FiCamera className="w-3.5 h-3.5" /> Take Photo
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer"
          >
            <FiUpload className="w-3.5 h-3.5" /> Upload
          </button>
          <button
            type="button"
            onClick={() => onChange(randomAvatar(150))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all cursor-pointer"
            title="Use a random sample avatar"
          >
            <FiShuffle className="w-3.5 h-3.5" /> Sample
          </button>
        </div>
        <p className="text-[10px] text-gray-600">JPG/PNG/webp under 1MB. Drag &amp; drop or take a photo.</p>
      </div>
    </div>
  )
}

export default ImageUpload