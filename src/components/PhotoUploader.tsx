import { useRef, useState } from 'react'
import { Camera, ImagePlus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhotoUploaderProps {
  photos: string[]
  onChange: (photos: string[]) => void
  maxPhotos?: number
  showLabel?: boolean
}

export default function PhotoUploader({ photos, onChange, maxPhotos = 9, showLabel = true }: PhotoUploaderProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  const handleFile = (files: FileList | null) => {
    if (!files) return
    const remaining = maxPhotos - photos.length
    const filesToProcess = Array.from(files).slice(0, remaining)

    filesToProcess.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        onChange([...photos, dataUrl])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index))
  }

  return (
    <div>
      {showLabel && (
        <label className="text-xs font-medium text-stone-500 mb-2 flex items-center gap-1.5">
          <ImagePlus size={12} />现场照片 <span className="text-stone-300">({photos.length}/{maxPhotos})</span>
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {photos.map((photo, index) => (
          <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden shadow-sm border border-stone-100 group">
            <img
              src={photo}
              alt={`现场照片 ${index + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setPreviewIndex(index)}
            />
            <button
              onClick={() => removePhoto(index)}
              className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        {photos.length < maxPhotos && (
          <div className="flex gap-2">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-20 h-20 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center text-stone-400 hover:border-orange-400 hover:text-orange-400 transition-colors"
            >
              <Camera size={18} />
              <span className="text-[10px] mt-1">拍照</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center text-stone-400 hover:border-orange-400 hover:text-orange-400 transition-colors"
            >
              <ImagePlus size={18} />
              <span className="text-[10px] mt-1">相册</span>
            </button>
          </div>
        )}
      </div>
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => handleFile(e.target.files)}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFile(e.target.files)}
      />

      {previewIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setPreviewIndex(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
            onClick={() => setPreviewIndex(null)}
          >
            <X size={20} />
          </button>
          <img
            src={photos[previewIndex]}
            alt="预览"
            className="max-w-full max-h-full object-contain"
          />
          {photos.length > 1 && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setPreviewIndex(i) }}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    i === previewIndex ? 'bg-white' : 'bg-white/30'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
