import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquareWarning, Clock, CheckCircle2, AlertCircle, Plus, MapPin } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { projects } from '@/data/mockData'
import { cn } from '@/lib/utils'

export default function Feedback() {
  const navigate = useNavigate()
  const { feedbacks, currentProjectId, currentRole } = useStore()
  const [filter, setFilter] = useState<'全部' | '待处理' | '已处理'>('全部')

  const project = projects.find(p => p.id === currentProjectId)

  const projectFeedbacks = currentProjectId
    ? feedbacks.filter(f => f.projectId === currentProjectId)
    : feedbacks

  const filteredFeedbacks = projectFeedbacks.filter(fb => {
    if (filter === '全部') return true
    return fb.status === filter
  })

  const pendingCount = projectFeedbacks.filter(f => f.status === '待处理').length
  const handledCount = projectFeedbacks.filter(f => f.status === '已处理').length

  return (
    <div className="px-4 pt-12 pb-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-stone-900">反馈记录</h1>
          <p className="text-stone-400 text-xs mt-1">
            {project ? `${project.name} · 共${projectFeedbacks.length}条` : '全部项目反馈记录'}
          </p>
        </div>
        <button
          onClick={() => navigate('/feedback/new')}
          className="bg-orange-500 text-white rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-[0.97] transition-transform"
        >
          <Plus size={14} />
          新反馈
        </button>
      </div>

      {currentProjectId && (
        <div className="flex gap-2 mb-4">
          {(['全部', '待处理', '已处理'] as const).map(status => {
            const count = status === '全部' ? projectFeedbacks.length : status === '待处理' ? pendingCount : handledCount
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors',
                  filter === status
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-stone-500 border border-stone-200'
                )}
              >
                {status}
                <span className={cn(
                  'px-1.5 py-0.5 rounded-md',
                  filter === status ? 'bg-white/20' : 'bg-stone-100'
                )}>{count}</span>
              </button>
            )
          })}
        </div>
      )}

      {projectFeedbacks.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-100">
          <MessageSquareWarning size={40} className="text-stone-200 mx-auto mb-3" />
          <p className="text-stone-400 text-sm">暂无反馈记录</p>
          <p className="text-stone-300 text-xs mt-1">发现方案与现场条件不符时可提交反馈</p>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-100">
          <p className="text-stone-400 text-sm">没有符合条件的反馈</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFeedbacks.map(fb => {
            const fbProject = projects.find(p => p.id === fb.projectId)
            return (
              <button
                key={fb.id}
                onClick={() => navigate(`/feedback/${fb.id}`)}
                className="w-full bg-white rounded-2xl p-4 border border-stone-100 shadow-sm text-left active:scale-[0.99] transition-transform"
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                    fb.status === '待处理' ? 'bg-amber-50' : 'bg-emerald-50'
                  )}>
                    {fb.status === '待处理' ? (
                      <AlertCircle size={18} className="text-amber-500" />
                    ) : (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
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
                    <p className="text-sm text-stone-800 line-clamp-2 leading-relaxed">{fb.description}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-[10px] bg-stone-50 text-stone-400 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <MapPin size={8} />
                        {fb.location}
                      </span>
                      {fbProject && (
                        <span className="text-[10px] bg-stone-50 text-stone-400 px-1.5 py-0.5 rounded">
                          {fbProject.name}
                        </span>
                      )}
                      {fb.photos.length > 0 && (
                        <span className="text-[10px] bg-stone-50 text-stone-400 px-1.5 py-0.5 rounded">
                          📷 {fb.photos.length}张
                        </span>
                      )}
                      <span className="text-[10px] text-stone-300">
                        {fb.reporterName}
                      </span>
                    </div>
                    {fb.handlerComment && (
                      <div className="mt-2 bg-emerald-50 rounded-lg p-2 border border-emerald-100">
                        <p className="text-[11px] text-emerald-700 leading-relaxed">
                          <span className="font-medium">处理意见：</span>
                          {fb.handlerComment}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
