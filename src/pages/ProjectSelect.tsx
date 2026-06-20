import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, ChevronRight, ArrowLeft } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { projects } from '@/data/mockData'
import { cn } from '@/lib/utils'

export default function ProjectSelect() {
  const navigate = useNavigate()
  const { setProject, currentRole } = useStore()
  const [search, setSearch] = useState('')

  const roleLabel = currentRole === 'safety' ? '安全员' : currentRole === 'construction' ? '施工员' : '班组长'

  const filtered = projects.filter(p =>
    p.name.includes(search) || p.address.includes(search)
  )

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="text-white/70 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">选择项目</h1>
            <p className="text-stone-400 text-xs">当前角色：{roleLabel}</p>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索项目名称或地址"
            className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder:text-stone-500 text-sm focus:outline-none focus:border-orange-500/50"
          />
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {filtered.map(project => (
          <button
            key={project.id}
            onClick={() => {
              setProject(project.id)
              navigate(`/projects/${project.id}/types`)
            }}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-start gap-3 text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin size={18} className="text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-stone-900 text-sm">{project.name}</div>
              <div className="text-stone-400 text-xs mt-0.5 truncate">{project.address}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium',
                project.status === '进行中' && 'bg-emerald-50 text-emerald-600',
                project.status === '已完工' && 'bg-stone-100 text-stone-500',
                project.status === '暂停' && 'bg-red-50 text-red-500',
              )}>
                {project.status}
              </span>
              <ChevronRight size={16} className="text-stone-300" />
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-stone-400 text-sm py-12">未找到匹配的项目</div>
        )}
      </div>
    </div>
  )
}
