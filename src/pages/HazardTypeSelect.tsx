import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { ArrowLeft, Pickaxe, Construction, LayoutGrid, Hammer, Building2, Anchor } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { hazardTypes } from '@/data/mockData'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Scaffold: Building2, Pickaxe, Construction, LayoutGrid, Crane: Anchor, Hammer,
}

const typeColors: Record<string, { bg: string; text: string; icon: string }> = {
  'ht1': { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-500' },
  'ht2': { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500' },
  'ht3': { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-500' },
  'ht4': { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500' },
  'ht5': { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-500' },
  'ht6': { bg: 'bg-teal-50', text: 'text-teal-700', icon: 'text-teal-500' },
}

export default function HazardTypeSelect() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { setType, setProject, currentRole, currentProjectId } = useStore()

  const roleLabel = currentRole === 'safety' ? '安全员' : currentRole === 'construction' ? '施工员' : '班组长'

  const types = hazardTypes.filter(h => h.projectId === projectId)

  useEffect(() => {
    if (projectId && projectId !== currentProjectId) {
      setProject(projectId)
    }
  }, [projectId, currentProjectId, setProject])

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 px-4 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/projects')} className="text-white/70 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">选择危大工程类型</h1>
            <p className="text-stone-400 text-xs">{roleLabel}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {types.map((ht) => {
            const Icon = iconMap[ht.icon] || Construction
            const colors = typeColors[ht.id] || { bg: 'bg-stone-50', text: 'text-stone-700', icon: 'text-stone-500' }
            return (
              <button
                key={ht.id}
                onClick={() => {
                  setType(ht.id)
                  navigate(`/projects/${projectId}/types/${ht.id}`)
                }}
                className={cn(
                  'rounded-2xl p-4 shadow-sm border border-stone-100 text-left active:scale-[0.96] transition-transform',
                  colors.bg
                )}
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-white/80 mb-3', colors.icon)}>
                  <Icon size={22} />
                </div>
                <div className={cn('font-semibold text-sm', colors.text)}>{ht.name}</div>
                <div className="text-stone-400 text-xs mt-1 line-clamp-2">{ht.description}</div>
              </button>
            )
          })}
        </div>
        {types.length === 0 && (
          <div className="text-center text-stone-400 text-sm py-12">该项目暂无危大工程类型</div>
        )}
      </div>
    </div>
  )
}
