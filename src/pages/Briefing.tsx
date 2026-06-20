import { useNavigate } from 'react-router-dom'
import { ClipboardCheck, Users, HelpCircle, Camera, ChevronRight, Plus } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

export default function Briefing() {
  const navigate = useNavigate()
  const { getScheme, briefingSessions, currentSchemeId } = useStore()
  const scheme = getScheme()

  const sessions = briefingSessions.filter(s => s.schemeId === currentSchemeId)

  return (
    <div className="px-4 pt-12 pb-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-stone-900">交底签到</h1>
        <p className="text-stone-400 text-xs mt-1">
          {scheme ? scheme.title : '请先选择方案'}
        </p>
      </div>

      {scheme && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => navigate('/briefing/sign')}
            className="bg-orange-500 rounded-2xl p-4 text-left active:scale-[0.97] transition-transform shadow-sm"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
              <Users size={20} className="text-white" />
            </div>
            <div className="text-white font-semibold text-sm">人员签到</div>
            <div className="text-orange-100 text-xs mt-0.5">填写信息并签名</div>
          </button>
          <button
            onClick={() => navigate('/briefing/quiz')}
            className="bg-white rounded-2xl p-4 text-left border border-stone-100 active:scale-[0.97] transition-transform shadow-sm"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <HelpCircle size={20} className="text-blue-500" />
            </div>
            <div className="text-stone-900 font-semibold text-sm">要点问答</div>
            <div className="text-stone-400 text-xs mt-0.5">检验掌握程度</div>
          </button>
        </div>
      )}

      {!scheme && (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-100 mb-6">
          <ClipboardCheck size={40} className="text-stone-200 mx-auto mb-3" />
          <p className="text-stone-400 text-sm">请先在方案卡中选择危大工程方案</p>
          <button
            onClick={() => navigate('/scheme')}
            className="mt-3 text-orange-500 text-sm font-medium"
          >
            去选择 →
          </button>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-stone-700 mb-3">交底记录</h2>
        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-stone-100">
            <p className="text-stone-400 text-sm">暂无交底记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(session => (
              <div key={session.id} className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-stone-900">{session.date}</span>
                  <span className="text-xs text-stone-400">{session.location}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {session.signRecords.length}人签到
                  </span>
                  <span className="flex items-center gap-1">
                    <Camera size={12} />
                    {session.photos.length}张照片
                  </span>
                </div>
                {session.signRecords.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {session.signRecords.map(sr => (
                      <span key={sr.id} className="text-[10px] bg-stone-50 text-stone-500 px-2 py-0.5 rounded-full">
                        {sr.name}·{sr.trade}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
