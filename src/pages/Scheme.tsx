import { useNavigate } from 'react-router-dom'
import { MapPin, ChevronRight, FileText } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { projects } from '@/data/mockData'
import { cn } from '@/lib/utils'

export default function Scheme() {
  const navigate = useNavigate()
  const { currentProjectId, currentTypeId, currentSchemeId, getScheme } = useStore()
  const scheme = getScheme()
  const currentProject = projects.find(p => p.id === currentProjectId)

  return (
    <div className="px-4 pt-12 pb-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-stone-900">方案卡</h1>
        <p className="text-stone-400 text-xs mt-1">危大工程专项方案查看</p>
      </div>

      {scheme && currentProject ? (
        <div>
          <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={12} className="text-stone-400" />
              <span className="text-stone-400 text-xs">{currentProject.name}</span>
            </div>
            <h2 className="text-white font-semibold text-sm">{scheme.title}</h2>
            <p className="text-stone-400 text-xs mt-1 line-clamp-2">{scheme.description}</p>
          </div>

          <button
            onClick={() => navigate(`/projects/${currentProjectId}/types/${currentTypeId}`)}
            className="w-full bg-orange-500 text-white rounded-xl py-3 text-sm font-semibold shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-transform mb-3"
          >
            查看方案详情
          </button>

          <button
            onClick={() => navigate(`/projects/${currentProjectId}/types`)}
            className="w-full bg-white text-stone-600 rounded-xl py-3 text-sm font-medium border border-stone-200 active:scale-[0.98] transition-transform"
          >
            切换工程类型
          </button>
        </div>
      ) : currentProject ? (
        <div>
          <div className="bg-stone-100 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={12} className="text-stone-400" />
              <span className="text-stone-500 text-xs">{currentProject.name}</span>
            </div>
            <p className="text-stone-400 text-xs">请选择危大工程类型</p>
          </div>
          <button
            onClick={() => navigate(`/projects/${currentProjectId}/types`)}
            className="w-full bg-orange-500 text-white rounded-xl py-3 text-sm font-semibold shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-transform"
          >
            选择工程类型
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => {
                navigate(`/projects/${project.id}/types`)
              }}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-start gap-3 text-left active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-stone-900 text-sm">{project.name}</div>
                <div className="text-stone-400 text-xs mt-0.5 truncate">{project.address}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  project.status === '进行中' && 'bg-emerald-50 text-emerald-600',
                  project.status === '暂停' && 'bg-red-50 text-red-500',
                )}>
                  {project.status}
                </span>
                <ChevronRight size={16} className="text-stone-300" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
