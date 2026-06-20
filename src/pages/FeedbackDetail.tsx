import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, User, CheckCircle2, AlertCircle } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

export default function FeedbackDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { feedbacks, updateFeedbackStatus, currentRole } = useStore()

  const feedback = feedbacks.find(f => f.id === id)

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

  return (
    <div className="min-h-screen bg-stone-50 pb-8">
      <div className="bg-white border-b border-stone-100 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/feedback')} className="text-stone-500">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-stone-900">反馈详情</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className={cn(
          'rounded-2xl p-4 flex items-center gap-3',
          feedback.status === '待处理' ? 'bg-amber-50 border border-amber-100' : 'bg-emerald-50 border border-emerald-100'
        )}>
          {feedback.status === '待处理' ? (
            <AlertCircle size={20} className="text-amber-500" />
          ) : (
            <CheckCircle2 size={20} className="text-emerald-500" />
          )}
          <div>
            <span className={cn(
              'text-sm font-semibold',
              feedback.status === '待处理' ? 'text-amber-700' : 'text-emerald-700'
            )}>
              {feedback.status}
            </span>
          </div>
          {currentRole === 'safety' && feedback.status === '待处理' && (
            <button
              onClick={() => updateFeedbackStatus(feedback.id, '已处理')}
              className="ml-auto bg-orange-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium active:scale-[0.97] transition-transform"
            >
              标记已处理
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-900 mb-2">问题描述</h3>
          <p className="text-stone-600 text-sm leading-relaxed">{feedback.description}</p>
        </div>

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
    </div>
  )
}
