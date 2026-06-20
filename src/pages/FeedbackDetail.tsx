import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, User, CheckCircle2, AlertCircle, ImagePlus, MessageSquare, CalendarDays } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { projects } from '@/data/mockData'
import { cn } from '@/lib/utils'

export default function FeedbackDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { feedbacks, handleFeedback, currentRole } = useStore()

  const [handlerComment, setHandlerComment] = useState('')
  const [showHandler, setShowHandler] = useState(false)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  const feedback = feedbacks.find(f => f.id === id)
  const project = projects.find(p => p.id === feedback?.projectId)

  if (!feedback) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-400">未找到反馈记录</p>
      </div>
    )
  }

  const roleNames: Record<string, string> = {
    safety: '安全员',
    construction: '施工员',
    teamLeader: '班组长',
  }

  const handleSubmit = () => {
    if (!handlerComment.trim()) return
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    handleFeedback(feedback.id, handlerComment.trim(), timeStr)
    setShowHandler(false)
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-8">
      <div className="bg-white border-b border-stone-100 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/feedback')} className="text-stone-500">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-stone-900">反馈详情</h1>
            {project && <p className="text-stone-400 text-xs mt-0.5">{project.name}</p>}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className={cn(
          'rounded-2xl p-4',
          feedback.status === '待处理' ? 'bg-amber-50 border border-amber-100' : 'bg-emerald-50 border border-emerald-100'
        )}>
          <div className="flex items-center gap-3">
            {feedback.status === '待处理' ? (
              <AlertCircle size={20} className="text-amber-500 flex-shrink-0" />
            ) : (
              <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
            )}
            <div className="flex-1">
              <span className={cn(
                'text-sm font-semibold',
                feedback.status === '待处理' ? 'text-amber-700' : 'text-emerald-700'
              )}>
                {feedback.status}
              </span>
              {feedback.handlerTime && (
                <p className="text-xs text-emerald-600 mt-0.5">处理时间：{feedback.handlerTime}</p>
              )}
            </div>
            {feedback.status === '待处理' && (
              <button
                onClick={() => setShowHandler(!showHandler)}
                className="flex items-center gap-1 bg-orange-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium active:scale-[0.97] transition-transform"
              >
                处理反馈
              </button>
            )}
          </div>
        </div>

        {showHandler && feedback.status === '待处理' && (
          <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm animate-fade-in">
            <h3 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
              <MessageSquare size={14} className="text-orange-500" />
              处理意见
            </h3>
            <textarea
              value={handlerComment}
              onChange={e => setHandlerComment(e.target.value)}
              placeholder="请填写处理意见..."
              rows={3}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 placeholder:text-stone-300 resize-none"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowHandler(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-stone-500 bg-stone-100 active:scale-[0.98] transition-transform"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!handlerComment.trim()}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  handlerComment.trim()
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 active:scale-[0.98]'
                    : 'bg-stone-100 text-stone-300 cursor-not-allowed'
                )}
              >
                确认处理
              </button>
            </div>
          </div>
        )}

        {feedback.handlerComment && (
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <h3 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-2">
              <MessageSquare size={14} />
              处理意见
            </h3>
            <p className="text-sm text-emerald-700 leading-relaxed">{feedback.handlerComment}</p>
            {feedback.handlerTime && (
              <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
                <CalendarDays size={10} />
                {feedback.handlerTime}
              </p>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-900 mb-2">问题描述</h3>
          <p className="text-stone-600 text-sm leading-relaxed">{feedback.description}</p>
        </div>

        {feedback.photos.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
            <h3 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
              <ImagePlus size={14} className="text-orange-500" />
              现场照片 <span className="text-stone-300 text-xs">({feedback.photos.length}张)</span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {feedback.photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl overflow-hidden bg-stone-100 cursor-pointer active:opacity-80 transition-opacity"
                  onClick={() => setPreviewIndex(index)}
                >
                  <img src={photo} alt={`现场照片${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-stone-400" />
            <span className="text-stone-400">位置：</span>
            <span className="text-stone-700">{feedback.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={14} className="text-stone-400" />
            <span className="text-stone-400">时间：</span>
            <span className="text-stone-700">{feedback.createdAt}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User size={14} className="text-stone-400" />
            <span className="text-stone-400">上报人：</span>
            <span className="text-stone-700">{feedback.reporterName}（{roleNames[feedback.reporterRole]}）</span>
          </div>
        </div>
      </div>

      {previewIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setPreviewIndex(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
            onClick={() => setPreviewIndex(null)}
          >
            <ArrowLeft size={20} className="rotate-180" />
          </button>
          <img
            src={feedback.photos[previewIndex]}
            alt="预览"
            className="max-w-full max-h-full object-contain"
          />
          {feedback.photos.length > 1 && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
              {feedback.photos.map((_, i) => (
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
