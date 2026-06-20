import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Briefcase, CreditCard, Camera, Check } from 'lucide-react'
import { useStore } from '@/store/useStore'
import SignaturePad from '@/components/SignaturePad'
import type { SignRecord, BriefingSession } from '@/types'
import { cn } from '@/lib/utils'

const trades = ['架子工', '木工', '钢筋工', '混凝土工', '电焊工', '起重工', '普工', '其他']

export default function BriefingSign() {
  const navigate = useNavigate()
  const { getScheme, getLatestSession, addSignRecord, createBriefingSession, currentSchemeId } = useStore()
  const scheme = getScheme()

  const [name, setName] = useState('')
  const [trade, setTrade] = useState('')
  const [idCard, setIdCard] = useState('')
  const [signature, setSignature] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSign = () => {
    if (!name || !trade || !idCard || !signature || !scheme) return

    let session = getLatestSession()
    if (!session) {
      const now = new Date()
      const newSession: BriefingSession = {
        id: `bs_${Date.now()}`,
        schemeId: currentSchemeId!,
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
        location: scheme.title,
        signRecords: [],
        photos: [],
      }
      createBriefingSession(newSession)
      session = newSession
    }

    const record: SignRecord = {
      id: `sr_${Date.now()}`,
      name,
      trade,
      idCard,
      signature,
      signedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }

    addSignRecord(session, record)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <Check size={32} className="text-emerald-500" />
        </div>
        <h2 className="text-lg font-bold text-stone-900">签到成功</h2>
        <p className="text-stone-400 text-sm mt-1">{name}·{trade} 已完成交底签到</p>
        <button
          onClick={() => {
            setName('')
            setTrade('')
            setIdCard('')
            setSignature('')
            setSubmitted(false)
          }}
          className="mt-4 text-orange-500 text-sm font-medium"
        >
          继续签到下一位
        </button>
        <button
          onClick={() => navigate('/briefing')}
          className="mt-2 text-stone-400 text-sm"
        >
          返回交底记录
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-8">
      <div className="bg-white border-b border-stone-100 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/briefing')} className="text-stone-500">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-stone-900">人员签到</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-stone-500 mb-1 flex items-center gap-1.5">
              <User size={12} />姓名
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="请输入姓名"
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 placeholder:text-stone-300"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 mb-2 flex items-center gap-1.5">
              <Briefcase size={12} />工种
            </label>
            <div className="flex flex-wrap gap-2">
              {trades.map(t => (
                <button
                  key={t}
                  onClick={() => setTrade(t)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    trade === t
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-stone-500 border border-stone-200'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 mb-1 flex items-center gap-1.5">
              <CreditCard size={12} />身份证号
            </label>
            <input
              type="text"
              value={idCard}
              onChange={e => setIdCard(e.target.value)}
              placeholder="请输入身份证号"
              maxLength={18}
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 placeholder:text-stone-300"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-stone-500 mb-2 block">电子签名</label>
          <SignaturePad onComplete={setSignature} height={140} />
        </div>

        <button
          onClick={handleSign}
          disabled={!name || !trade || !idCard || !signature}
          className={cn(
            'w-full py-3.5 rounded-xl text-sm font-semibold transition-all',
            name && trade && idCard && signature
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 active:scale-[0.98]'
              : 'bg-stone-100 text-stone-300 cursor-not-allowed'
          )}
        >
          确认签到
        </button>
      </div>
    </div>
  )
}
