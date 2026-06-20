import { useRef, useState, useEffect } from 'react'
import { Eraser } from 'lucide-react'

interface SignaturePadProps {
  onComplete: (dataUrl: string) => void
  height?: number
}

export default function SignaturePad({ onComplete, height = 160 }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasContent, setHasContent] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    ctx.strokeStyle = '#1C1917'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top }
  }

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    const ctx = canvasRef.current?.getContext('2d')
    const pos = getPos(e)
    ctx?.beginPath()
    ctx?.moveTo(pos.x, pos.y)
  }

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    const ctx = canvasRef.current?.getContext('2d')
    const pos = getPos(e)
    ctx?.lineTo(pos.x, pos.y)
    ctx?.stroke()
    setHasContent(true)
  }

  const endDraw = () => {
    if (isDrawing && hasContent) {
      const dataUrl = canvasRef.current?.toDataURL('image/png') ?? ''
      onComplete(dataUrl)
    }
    setIsDrawing(false)
  }

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasContent(false)
    onComplete('')
  }

  return (
    <div className="relative">
      <div
        className="border-2 border-dashed border-stone-300 rounded-xl bg-white overflow-hidden touch-none"
        style={{ height }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
        />
      </div>
      {hasContent && (
        <button
          onClick={clear}
          className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-sm text-stone-500 hover:text-stone-700"
        >
          <Eraser size={14} />
        </button>
      )}
      {!hasContent && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-stone-300 text-sm">在此处签名</span>
        </div>
      )}
    </div>
  )
}
