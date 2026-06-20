import { useNavigate } from 'react-router-dom'
import { MessageSquareWarning, Clock, CheckCircle2, AlertCircle, Plus } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

export default function Feedback() {
  const navigate = useNavigate()
  const { feedbacks, currentProjectId, currentRole } = useStore()

  const projectFeedbacks = feedbacks.filter(f => f.projectId === currentProjectId)

  return (
    <div className="px-4 pt-12 pb-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-stone-900">反馈记录</h1>
          <p className="text-stone-400 text-xs mt-1">现场问题反馈与追踪</p>
        </div>
        <button
          onClick={() => navigate('/feedback/new')}
          className="bg-orange-500 text-white rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-[0.97] transition-transform"
        >
          <Plus size={14} />
          新反馈
        </button>
      </div>

      {projectFeedbacks.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-100">
          <MessageSquareWarning size={40} className="text-stone-200 mx-auto mb-3" />
          <p className="text-stone-400 text-sm">暂无反馈记录</p>
          <p className="text-stone-300 text-xs mt-1">发现方案与现场条件不符时可提交反馈</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projectFeedbacks.map(fb => (
            <button
              key={fb.id}
              onClick={() => navigate(`/feedback/${fb.id}`)}
              className="w-full bg-white rounded-2xl p-4 border border-stone-100 shadow-sm text-left active:scale-[0.99] transition-transform"
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                  fb.status === '待处理' ? 'bg-amber-50' : 'bg-emerald-50'
                )}>
                  {fb.status === '待处理' ? (
                    <AlertCircle size={16} className="text-amber-500" />
                  ) : (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded font-medium',
                      fb.status === '待处理' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    )}>
                      {fb.status}
                    </span>
                    <span className="text-stone-300 text-[10px] flex items-center gap-0.5">
                      <Clock size={10} />
                      {fb.createdAt}
                    </span>
                  </div>
                  <p className="text-sm text-stone-800 mt-1 line-clamp-2">{fb.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] bg-stone-50 text-stone-400 px-1.5 py-0.5 rounded">
                      {fb.location}
                    </span>
                    <span className="text-[10px] text-stone-300">
                      {fb.reporterName}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
