import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, ListOrdered, CheckSquare, Ban, ChevronRight } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

type TabKey = 'control' | 'steps' | 'acceptance' | 'prohibition'

import type { LucideIcon } from 'lucide-react'

const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'control', label: '控制点', icon: AlertTriangle },
  { key: 'steps', label: '施工顺序', icon: ListOrdered },
  { key: 'acceptance', label: '验收节点', icon: CheckSquare },
  { key: 'prohibition', label: '禁止事项', icon: Ban },
]

export default function SchemeDetail() {
  const { projectId, typeId } = useParams()
  const navigate = useNavigate()
  const {
    getScheme,
    getControlPoints,
    getConstructionSteps,
    getAcceptanceNodes,
    getProhibitions,
    setProject,
    setType,
    currentProjectId,
    currentTypeId,
  } = useStore()
  const [activeTab, setActiveTab] = useState<TabKey>('control')

  useEffect(() => {
    if (projectId && projectId !== currentProjectId) {
      setProject(projectId)
    }
    if (typeId && typeId !== currentTypeId) {
      setType(typeId)
    }
  }, [projectId, typeId, currentProjectId, currentTypeId, setProject, setType])

  const scheme = getScheme()
  const controlPts = getControlPoints()
  const steps = getConstructionSteps()
  const acceptances = getAcceptanceNodes()
  const prohibitions = getProhibitions()

  if (!scheme) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-400">未找到方案信息</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(`/projects/${projectId}/types`)} className="text-white/70 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-white flex-1 truncate">{scheme.title}</h1>
        </div>
        <p className="text-stone-400 text-xs leading-relaxed">{scheme.description}</p>
      </div>

      <div className="sticky top-0 z-10 bg-white border-b border-stone-100 shadow-sm">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2',
                activeTab === tab.key
                  ? 'text-orange-500 border-orange-500'
                  : 'text-stone-400 border-transparent'
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {activeTab === 'control' && (
          <div className="space-y-3">
            {controlPts.map(cp => (
              <div key={cp.id} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                    cp.level === 'critical' && 'bg-red-500',
                    cp.level === 'important' && 'bg-amber-500',
                    cp.level === 'normal' && 'bg-stone-300',
                  )} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-stone-900">{cp.title}</span>
                      {cp.level === 'critical' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium">关键</span>
                      )}
                      {cp.level === 'important' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-medium">重要</span>
                      )}
                    </div>
                    <p className="text-stone-500 text-xs mt-1 leading-relaxed">{cp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="relative pl-6">
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-orange-200" />
            <div className="space-y-4">
              {steps.map(step => (
                <div key={step.id} className="relative">
                  <div className="absolute -left-3.5 top-1.5 w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">{step.order}</span>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 ml-3">
                    <div className="font-semibold text-sm text-stone-900">{step.title}</div>
                    <p className="text-stone-500 text-xs mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'acceptance' && (
          <div className="space-y-3">
            {acceptances.map(an => (
              <div key={an.id} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-start gap-3">
                <div className={cn(
                  'w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5',
                  an.type === '必检' ? 'bg-orange-100' : 'bg-stone-100'
                )}>
                  <CheckSquare size={12} className={an.type === '必检' ? 'text-orange-500' : 'text-stone-400'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-stone-900">{an.title}</span>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded font-medium',
                      an.type === '必检' ? 'bg-orange-50 text-orange-600' : 'bg-stone-100 text-stone-500'
                    )}>
                      {an.type}
                    </span>
                  </div>
                  <p className="text-stone-500 text-xs mt-1 leading-relaxed">{an.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'prohibition' && (
          <div className="space-y-3">
            {prohibitions.map(pr => (
              <div key={pr.id} className="bg-red-50 rounded-2xl p-4 border border-red-100">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Ban size={12} className="text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-red-800">{pr.title}</div>
                    <p className="text-red-600/70 text-xs mt-1 leading-relaxed">{pr.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-16 left-0 right-0 px-4 pb-3">
        <div className="max-w-md mx-auto flex gap-3">
          <button
            onClick={() => navigate('/briefing')}
            className="flex-1 bg-orange-500 text-white rounded-xl py-3 text-sm font-semibold shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-transform"
          >
            发起交底
          </button>
          <button
            onClick={() => navigate('/feedback/new')}
            className="flex items-center justify-center gap-1.5 bg-white text-stone-600 rounded-xl py-3 px-4 text-sm font-medium border border-stone-200 active:scale-[0.98] transition-transform"
          >
            现场反馈
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
