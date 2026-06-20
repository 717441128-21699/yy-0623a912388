import { useNavigate } from 'react-router-dom'
import { ShieldCheck, HardHat, Users } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { UserRole } from '@/types'
import { cn } from '@/lib/utils'

const roles: { key: UserRole; label: string; desc: string; icon: typeof ShieldCheck }[] = [
  { key: 'safety', label: '安全员', desc: '发起交底、补充照片、处理反馈', icon: ShieldCheck },
  { key: 'construction', label: '施工员', desc: '查看方案、参与交底、提交反馈', icon: HardHat },
  { key: 'teamLeader', label: '班组长', desc: '组织签到、要点问答、现场反馈', icon: Users },
]

export default function RoleSelect() {
  const navigate = useNavigate()
  const { setRole } = useStore()

  const handleSelect = (role: UserRole) => {
    setRole(role)
    navigate('/projects')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 flex flex-col items-center justify-center px-6 py-12">
      <div className="mb-2">
        <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
          <ShieldCheck size={32} className="text-white" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-white mt-4 tracking-tight">危大工程交底</h1>
      <p className="text-stone-400 text-sm mt-1 mb-10">方案现场交底移动平台</p>

      <div className="w-full max-w-sm space-y-3">
        {roles.map((r, i) => (
          <button
            key={r.key}
            onClick={() => handleSelect(r.key)}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200',
              'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/50',
              'active:scale-[0.98]'
            )}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              r.key === 'safety' && 'bg-orange-500/20 text-orange-400',
              r.key === 'construction' && 'bg-blue-500/20 text-blue-400',
              r.key === 'teamLeader' && 'bg-emerald-500/20 text-emerald-400',
            )}>
              <r.icon size={24} />
            </div>
            <div className="text-left">
              <div className="text-white font-semibold">{r.label}</div>
              <div className="text-stone-400 text-xs mt-0.5">{r.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-stone-500 text-xs mt-10">选择角色后进入项目选择</p>
    </div>
  )
}
