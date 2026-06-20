import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, MapPin, FileText, Check } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { Feedback } from '@/types'
import { cn } from '@/lib/utils'

export default function FeedbackNew() {
  const navigate = useNavigate()
  const { addFeedback, currentProjectId, currentSchemeId, currentRole } = useStore()

  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const roleNames: Record<string, string> = {
    safety: '安全员',
    construction: '施工员',
    teamLeader: '班组长',
  }

  const handleSubmit = () => {
    if (!description || !location) return

    const now = new Date()
    const feedback: Feedback = {
      id: `fb_${Date.now()}`,
      projectId: currentProjectId ?? '',
      schemeId: currentSchemeId ?? '',
      description,
      location,
      photos: [],
      status: '待处理',
      createdAt: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      reporterRole: currentRole!,
      reporterName: `${roleNames[currentRole ?? 'safety']}张`,
    }

    addFeedback(feedback)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <Check size={32} className="text-emerald-500" />
        </div>
        <h2 className="text-lg font-bold text-stone-900">反馈已提交</h2>
        <p className="text-stone-400 text-sm mt-1">技术负责人将尽快处理</p>
        <button
          onClick={() => navigate('/feedback')}
          className="mt-4 bg-orange-500 text-white rounded-xl px-6 py-2.5 text-sm font-semibold active:scale-[0.98] transition-transform"
        >
          查看反馈记录
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-8">
      <div className="bg-white border-b border-stone-100 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-stone-500">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-stone-900">提交现场反馈</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
          <p className="text-amber-700 text-xs">
            当发现方案与现场实际条件不符时，请拍照记录并描述具体位置和问题，提交给技术负责人处理。
          </p>
        </div>

        <div>
          <label className="text-xs font-medium text-stone-500 mb-2 flex items-center gap-1.5">
            <Camera size={12} />现场照片
          </label>
          <div className="flex gap-3">
            <button className="w-20 h-20 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center text-stone-300 hover:border-orange-400 hover:text-orange-400 transition-colors">
              <Camera size={20} />
              <span className="text-[10px] mt-1">拍照</span>
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-stone-500 mb-1 flex items-center gap-1.5">
            <MapPin size={12} />问题位置
          </label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="描述问题所在的具体位置"
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 placeholder:text-stone-300"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-stone-500 mb-1 flex items-center gap-1.5">
            <FileText size={12} />问题描述
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="详细描述方案与现场条件不符的情况"
            rows={4}
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 placeholder:text-stone-300 resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!description || !location}
          className={cn(
            'w-full py-3.5 rounded-xl text-sm font-semibold transition-all',
            description && location
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 active:scale-[0.98]'
              : 'bg-stone-100 text-stone-300 cursor-not-allowed'
          )}
        >
          提交反馈
        </button>
      </div>
    </div>
  )
}
