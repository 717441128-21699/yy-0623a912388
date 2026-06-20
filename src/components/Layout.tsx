import { useLocation, useNavigate } from 'react-router-dom'
import { FileText, ClipboardCheck, MessageSquareWarning } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { path: '/scheme', label: '方案卡', icon: FileText },
  { path: '/briefing', label: '交底签到', icon: ClipboardCheck },
  { path: '/feedback', label: '反馈记录', icon: MessageSquareWarning },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab = tabs.find(t => location.pathname.startsWith(t.path))

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <div className="flex-1 pb-16 overflow-auto">
        {children}
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50">
        <div className="max-w-md mx-auto flex">
          {tabs.map(tab => {
            const isActive = activeTab?.path === tab.path
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  'flex-1 flex flex-col items-center py-2 transition-colors',
                  isActive ? 'text-orange-500' : 'text-stone-400'
                )}
              >
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={cn('text-xs mt-0.5', isActive && 'font-semibold')}>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
