import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquareWarning, Clock, CheckCircle2, AlertCircle, Plus, MapPin, Search, SlidersHorizontal, X } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { projects, hazardTypes, schemes } from '@/data/mockData'
import { cn } from '@/lib/utils'

type StatusFilter = '全部' | '待处理' | '已处理' | '我处理的'

export default function Feedback() {
  const navigate = useNavigate()
  const { feedbacks, currentProjectId, currentHandlerName } = useStore()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('全部')
  const [keyword, setKeyword] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('全部')
  const [showFilters, setShowFilters] = useState(false)

  const project = projects.find(p => p.id === currentProjectId)

  const allTypesForProject = useMemo(() => {
    const relatedTypes = new Set<string>()
    feedbacks.forEach(fb => {
      if (!currentProjectId || fb.projectId === currentProjectId) {
        const scheme = schemes.find(s => s.id === fb.schemeId)
        if (scheme) {
          const ht = hazardTypes.find(h => h.id === scheme.typeId)
          if (ht) relatedTypes.add(ht.id)
        }
      }
    })
    return hazardTypes.filter(h => relatedTypes.has(h.id))
  }, [feedbacks, currentProjectId])

  const getTypeNameForFeedback = (schemeId: string) => {
    const scheme = schemes.find(s => s.id === schemeId)
    if (!scheme) return ''
    const ht = hazardTypes.find(h => h.id === scheme.typeId)
    return ht?.name ?? ''
  }

  const projectFeedbacks = useMemo(() => {
    return currentProjectId
      ? feedbacks.filter(f => f.projectId === currentProjectId)
      : feedbacks
  }, [feedbacks, currentProjectId])

  const filteredFeedbacks = useMemo(() => {
    return projectFeedbacks.filter(fb => {
      if (statusFilter === '待处理' || statusFilter === '已处理') {
        if (fb.status !== statusFilter) return false
      }
      if (statusFilter === '我处理的') {
        if (fb.handlerName !== currentHandlerName) return false
      }
      if (typeFilter !== '全部') {
        const scheme = schemes.find(s => s.id === fb.schemeId)
        if (!scheme || scheme.typeId !== typeFilter) return false
      }
      if (keyword.trim()) {
        const kw = keyword.trim().toLowerCase()
        const match =
          fb.description.toLowerCase().includes(kw) ||
          fb.location.toLowerCase().includes(kw) ||
          fb.reporterName.toLowerCase().includes(kw) ||
          getTypeNameForFeedback(fb.schemeId).toLowerCase().includes(kw) ||
          (fb.handlerComment ?? '').toLowerCase().includes(kw)
        if (!match) return false
      }
      return true
    })
  }, [projectFeedbacks, statusFilter, typeFilter, keyword, currentHandlerName])

  const stats = {
    total: projectFeedbacks.length,
    pending: projectFeedbacks.filter(f => f.status === '待处理').length,
    handled: projectFeedbacks.filter(f => f.status === '已处理').length,
    mine: projectFeedbacks.filter(f => f.handlerName === currentHandlerName).length,
  }

  const statusTabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: '全部', label: '全部', count: stats.total },
    { key: '待处理', label: '待处理', count: stats.pending },
    { key: '已处理', label: '已处理', count: stats.handled },
    { key: '我处理的', label: '我处理的', count: stats.mine },
  ]

  const activeFilters = (typeFilter !== '全部') || keyword.trim()

  return (
    <div className="px-4 pt-12 pb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900">反馈记录</h1>
          <p className="text-stone-400 text-xs mt-1">
            {project ? `${project.name}` : '全部项目'}
            {currentHandlerName && ` · 处理人：${currentHandlerName}`}
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

      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="搜索位置、描述或上报人..."
          className="w-full pl-8 pr-9 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 placeholder:text-stone-300"
        />
        {keyword.trim() && (
          <button
            onClick={() => setKeyword('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:bg-stone-200"
          >
            <X size={10} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors',
            activeFilters || showFilters
              ? 'bg-orange-50 text-orange-600 border border-orange-200'
              : 'bg-white text-stone-500 border border-stone-200'
          )}
        >
          <SlidersHorizontal size={12} />
          筛选
          {activeFilters && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm mb-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-stone-500 mb-2 block">工程类型</label>
            <div className="flex flex-wrap gap-2">
              {[{ id: '全部', name: '全部' }, ...allTypesForProject.map(t => ({ id: t.id, name: t.name }))].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTypeFilter(t.id)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                    typeFilter === t.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                  )}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
          {activeFilters && (
            <button
              onClick={() => { setTypeFilter('全部'); setKeyword('') }}
              className="text-xs text-orange-500 font-medium"
            >
              清除所有筛选
            </button>
          )}
        </div>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {statusTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap',
              statusFilter === tab.key
                ? 'bg-orange-500 text-white'
                : 'bg-white text-stone-500 border border-stone-200'
            )}
          >
            {tab.label}
            <span className={cn(
              'px-1.5 py-0.5 rounded-md text-[10px]',
              statusFilter === tab.key ? 'bg-white/20' : 'bg-stone-100'
            )}>{tab.count}</span>
          </button>
        ))}
      </div>

      {projectFeedbacks.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-100">
          <MessageSquareWarning size={40} className="text-stone-200 mx-auto mb-3" />
          <p className="text-stone-400 text-sm">暂无反馈记录</p>
          <p className="text-stone-300 text-xs mt-1">发现方案与现场条件不符时可提交反馈</p>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-100">
          <Search size={32} className="text-stone-200 mx-auto mb-2" />
          <p className="text-stone-400 text-sm">没有符合条件的反馈</p>
          <button
            onClick={() => { setKeyword(''); setTypeFilter('全部'); setStatusFilter('全部') }}
            className="mt-2 text-orange-500 text-xs font-medium"
          >
            清除筛选条件
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFeedbacks.map(fb => {
            const fbProject = projects.find(p => p.id === fb.projectId)
            const typeName = getTypeNameForFeedback(fb.schemeId)
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
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded font-medium',
                        fb.status === '待处理' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                      )}>
                        {fb.status}
                      </span>
                      {typeName && (
                        <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-medium">
                          {typeName}
                        </span>
                      )}
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
                      {fbProject && !currentProjectId && (
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
                        <p className="text-[11px] text-emerald-700 leading-relaxed line-clamp-2">
                          <span className="font-medium">{fb.handlerName ? `${fb.handlerName}：` : '处理意见：'}</span>
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
